import { Text } from 'react-native';

const MyText = (props) => {
  return (
    <Text
      {...props}
      style={[{fontFamily: 'LibreBaskerville-Regular', color: 'white'}, props.style]}
    >
      {props.children}
    </Text>
  );
}

const MyTextBold = (props) => {
  return (
    <Text
      {...props}
      style={[{fontFamily: 'LibreBaskerville-Bold', color: 'white'}, props.style]}
    >
      {props.children}
    </Text>
  );
}

export { MyText, MyTextBold};
export default MyText;