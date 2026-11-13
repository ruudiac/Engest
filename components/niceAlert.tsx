import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';

type AlertButton = { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
type AlertData = { title: string; message?: string; buttons: AlertButton[] };

// The host puts its "show" function here when it starts
let show: ((a: AlertData) => void) | null = null;

// Use it like Alert.alert: niceAlert('Title', 'Message', [buttons])
export function niceAlert(title: string, message?: string, buttons?: AlertButton[]) {
  show?.({ title, message, buttons: buttons?.length ? buttons : [{ text: 'OK' }] });
}

// Lives once in the root layout and draws whatever niceAlert asks for
export function NiceAlertHost() {
  const [alert, setAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    show = setAlert;
    return () => { show = null; };
  }, []);

  const press = (b: AlertButton) => {
    setAlert(null);   // close first
    b.onPress?.();    // then run what the button should do
  };

  // Button colors: cancel = light, destructive = pink, normal = dark purple
  const boxColor = (b: AlertButton) =>
    b.style === 'cancel' ? 'bg-[#F6E9FF]' : b.style === 'destructive' ? 'bg-[#D9568A]' : 'bg-[#543666]';
  const textColor = (b: AlertButton) => (b.style === 'cancel' ? 'text-[#7F39A6]' : 'text-white');

  return (
    <Modal visible={alert !== null} transparent animationType="fade" onRequestClose={() => setAlert(null)}>
      <View className="flex-1 items-center justify-center px-8 bg-black/40">
        {alert && (
          <View className="w-full bg-[#FBF5FF] rounded-3xl p-6 border border-[#E2BFF6] items-center">
            <Image source={require('../assets/images/wavinglogo.png')} style={{ width: 64, height: 64 }} resizeMode="contain" />
            <Text className="font-inter font-bold text-xl text-[#543666] text-center mt-2">{alert.title}</Text>
            {alert.message ? (
              <Text className="font-inter text-base text-[#875BA1] text-center mt-2 leading-6">{alert.message}</Text>
            ) : null}

            <View className="flex-row gap-3 mt-5 w-full">
              {alert.buttons.map((b) => (
                <Pressable key={b.text} onPress={() => press(b)} className={`flex-1 h-12 rounded-xl items-center justify-center ${boxColor(b)}`}>
                  <Text className={`font-inter font-semibold text-base ${textColor(b)}`}>{b.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}