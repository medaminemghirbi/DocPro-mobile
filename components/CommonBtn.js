import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CommonBtn = ({ w, h, txt, onClick, status }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
      disabled={!status} // Disable the button if status is false
    >
      <View
        style={{
          width: w,
          height: h,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          backgroundColor: status ? '#009FFD' : '#8e8e8e', // Conditional background color
          opacity: status ? 1 : 0.5, // Adjust opacity for inactive state
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>{txt}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommonBtn;
