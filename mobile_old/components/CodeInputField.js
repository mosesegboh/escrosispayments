import React, {useRef, useState, useEffect} from 'react'
import { CodeInputSection, 
    HiddenTextInput, 
    CodeInputContainer, 
    CodeInput, 
    CodeInputText, 
    CodeInputFocused,
    StyledButton,
    ButtonText
} from './styles'

const CodeInputField = ({setPinReady, code, setCode, maxLength}) => {
  const codeDigitsArray = new Array(maxLength).fill(0);
  const textInputRef = useRef(null)
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false)

  useEffect(() => {
    setPinReady(code.length === maxLength)
    return () => setPinReady(false)
  }, [code])

  const handleOnBlur = () => {
    setInputContainerIsFocused(false)
  }

  const handleOnPress = () => {
    // console.log('i was pressed o')
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  }

  const toCodeDigitInput = (_value, index) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;
    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull)
    const StyledCodeInput = inputContainerIsFocused && isDigitFocused ? CodeInputFocused : CodeInput;

    return(
        <StyledCodeInput key={index}>
            <CodeInputText>{digit}</CodeInputText>
        </StyledCodeInput>
    )
  }

  return (
        <CodeInputSection>
            <CodeInputContainer onPress={handleOnPress}>
                {codeDigitsArray.map(
                    toCodeDigitInput
                )}
            </CodeInputContainer>
            <HiddenTextInput 
                ref={textInputRef}
                // OnBlur={handleOnBlur}
                value={code}
                onChangeText={setCode}
                onSubmitEditing={handleOnBlur}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType = "oneTimeCode"
                maxLength = {maxLength}
            />
        </CodeInputSection>
  )
}

export default CodeInputField