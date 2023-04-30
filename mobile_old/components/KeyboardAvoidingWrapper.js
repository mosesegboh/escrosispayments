import React from 'react';
import { 
        KeyboardAvoidingView, 
         Keyboard, 
         ScrollView, 
         TouchableWithoutFeedback, 
         Platform 
} from 'react-native';

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor:'#131112' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : null} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;