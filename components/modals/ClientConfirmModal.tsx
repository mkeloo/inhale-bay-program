import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ModalContentWrapper from '../wrappers/ModalContentWrapper'

export default function ClientConfirmModal() {
    const [modalVisible, setModalVisible] = useState(false)
    const [confirm, setConfirm] = useState(false)
    return (
        <ModalContentWrapper modalVisible={modalVisible} setModalVisible={setModalVisible}>
            <View><Text>Hello</Text></View>
        </ModalContentWrapper>
    )
}