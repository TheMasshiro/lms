import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "./configs/theme";
import CodeEditor from "./CodeEditor";
import { useUser } from "@clerk/clerk-react";
import Loading from "../../../components/learner/Loading";

const EditorPage = () => {
  const { user } = useUser();

  return user ? (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="#f8f9fa" color="gray.700" px={6} py={8}>
        <CodeEditor />
      </Box>
    </ChakraProvider>
  ) : <Loading />;
};

export default EditorPage;