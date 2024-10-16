import Toast from "react-native-toast-message";

class Toaster {
    success(title: string, subtitle?: string) {
        Toast.show({
            type: 'success', 
            text1: title,
            text2: subtitle ?? ""
        })
    }
    error(title: string, subtitle?: string) {
        Toast.show({
            type: 'error', 
            text1: title,
            text2: subtitle ?? ""
        })
    }
    info(title: string, subtitle: string) {
        Toast.show({
            type: 'info', 
            text1: title, 
            text2: subtitle ?? ""
        })
    }
}

export const toast = new Toaster();