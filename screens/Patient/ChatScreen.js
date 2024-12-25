import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Image, Button, TouchableOpacity, RefreshControl,KeyboardAvoidingView,Platform, Alert } from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../services/apiConfig";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import CustomLoader from "../../components/CustomLoader";
const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);
  const [imageCount, setimageCount] = useState(0);

  const wsUrl = `${API_BASE_URL}/cable`; // WebSocket URL

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
      setimageCount(result.assets.length);
    }
  };

  // Fetch user data from AsyncStorage
  const fetchUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mobile/messages`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === '' && images.length === 0) {
      Alert.alert("Message Is Empty!", "Add text or select file.", [{ text: "OK" }]);
      return
    };
    try {
      const formData = new FormData();
      formData.append('message[body]', newMessage);
      formData.append('message[sender_id]', user?.id || null);

      // Append images to the formData
      images.forEach((image, index) => {
        formData.append(`message[images][]`, {
          uri: image.uri,
          type: image.mimeType,
          name: image.fileName,
        });
      });

      await axios.post(`${API_BASE_URL}/api/mobile/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewMessage(''); // Clear input
      setImages([]);
      setimageCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      onRefresh();
    }
  };

  // Refresh handler function
  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages(); // Fetch new messages on refresh
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(
        JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'MessagesChannel',
          }),
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // Ignore unwanted types like ping, welcome, or confirm_subscription
      if (['ping', 'welcome', 'confirm_subscription'].includes(data.type)) return;

      const message = data.message;
      if (message) {
        // Avoid duplication of messages based on message ID
        setMessages((prevMessages) => {
          if (!prevMessages.some((msg) => msg.id === message.id)) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Fetch messages initially
    fetchMessages();

    return () => {
      ws.close(); // Cleanup WebSocket connection on component unmount
    };
  }, []); // Empty dependency array ensures this effect runs once

  return (
    <View style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Messages List */}
        <ScrollView
          style={styles.messagesContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View style={styles.container}>
              <CustomLoader />
            </View>
          ) : messages.length === 0 ? (
            <Text style={styles.emptyMessageText}>No messages yet.</Text>
          ) : (
            messages.map((message, index) => (
              <View key={index} style={styles.messageContainer}>
                <View style={styles.senderImageContainer}>
                  <Image
                    source={{
                      uri: message.sender?.user_image_url_mobile,
                    }}
                    style={styles.doctorImage}
                  />
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.senderName}>
                    {message.sender?.type === "Doctor" ? "Dr. " : ""}
                    {message.sender?.firstname || "Unknown"}{" "}
                    {message.sender?.lastname || "Sender"}
                  </Text>

                  {/* If message.body is empty, loop through message_image_urls */}
                  {message.body && message.body.trim() !== "" ? (
                    <Text style={styles.messageText}>
                      {message.body || "No content available"}
                    </Text>
                  ) : (
                    <View style={styles.imageContainer}>
                      {message.message_image_urls &&
                      message.message_image_urls.length > 0 ? (
                        message.message_image_urls.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            source={{ uri: image.url }}
                            style={styles.messageImage}
                          />
                        ))
                      ) : (
                        <Text>No images available</Text>
                      )}
                    </View>
                  )}

                  <Text style={styles.timestamp}>
                    {message.created_at
                      ? new Date(message.created_at).toLocaleString()
                      : "Unknown date"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message here..."
            placeholderTextColor="#888"
          />
          {imageCount > 0 && (
            <Text style={styles.timestamp}>
              You have selected {imageCount} {imageCount === 1 ? "image" : "images"}
            </Text>
          )}

          
          {/* Gallery open button (icon) */}
          <TouchableOpacity onPress={pickImage} style={styles.galleryButton}>
            <Icon name="image" size={30} color="#0288D1" />
          </TouchableOpacity>

          {/* Send message button */}
          <Button title="Send" onPress={sendMessage} color="#0288D1" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "flex-start", // Start from the top
    backgroundColor: "#EAEFF3", // Light grayish-blue background
    padding: 15,
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#FFF", // White background for each message
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  senderImageContainer: {
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DDD",
  },
  senderName: {
    fontWeight: "bold",
    color: "#0288D1",
    fontSize: 16,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: "#B0BEC5",
    marginTop: 8,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 25,
    padding: 12,
    marginRight: 15,
    backgroundColor: "#F4F7FA",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#B0BEC5",
  },
  emptyMessageText: {
    fontSize: 18,
    color: "#B0BEC5",
    fontStyle: "italic",
    textAlign: "center",
  },
  galleryButton: {
    marginLeft: 10,
  },
});
export default ChatScreen;
