import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "react-query";

import RootNavigator from "./navigators/RootNavigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </>
  );
}
