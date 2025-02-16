export interface ScreenCodeProps {
    id: number
    name: string
    code: number
}

export interface ModalProps {
    children: React.ReactNode;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}