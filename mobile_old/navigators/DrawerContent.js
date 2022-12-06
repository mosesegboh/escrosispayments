import React from "react";
import { View, Text, StyleSheet } from 'react-native';
// import {
//     Avatar,
//     Title,
//     Caption,
//     Paragraph,
//     Drawer,
//     TouchableRipple,
//     Switch,
// } from 'react-native-paper'
// import {
//     DrawerContentScrollView,
//     DrawerItem
// } from '@react-navigation/drawer'


export default function DrawerContent(props) {
  return (
   <View style={{flex:1}}>
        {/* <DrawerContentScrollView>

        </DrawerContentScrollView> */}
   </View>
  )
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
