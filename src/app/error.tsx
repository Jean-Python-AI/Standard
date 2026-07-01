import { Pressable, Text, View } from 'react-native';

interface ErrorScreenProps {
  error: Error;
  retry: () => void;
}

export default function ErrorScreen({ error, retry }: ErrorScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Une erreur est survenue</Text>
      <Text>{error.message}</Text>

      <Pressable onPress={retry}>
        <Text>Réessayer</Text>
      </Pressable>
    </View>
  );
}