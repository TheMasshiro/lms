import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "./configs/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "green.600";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box ml={2} mb={4}>
      <Text mb={2} fontSize="lg" color="gray.800">
        Language:
      </Text>
      <Menu isLazy>
        <MenuButton as={Button} colorScheme="green">
          {language}
        </MenuButton>
        <MenuList bg="white" borderColor="green.200" boxShadow="md">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : "gray.800"}
              bg={lang === language ? "green.50" : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: "green.50",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="gray.500" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;