import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from 'react-native-vector-icons';

const Icons = ({ iconName, iconFamily }) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons} // icon library
      iconSize={23}
      color="black"
      icon={iconName} // Pass the icon name as a prop
    />
  );
};

export default Icons;