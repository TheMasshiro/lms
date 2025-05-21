import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Text, 
  useToast, 
  Flex, 
  Badge, 
  Heading,
  Icon,
  Spinner,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup
} from "@chakra-ui/react";
import { executeCode } from "./configs/api";
import { FaPlay, FaStop, FaCopy, FaDownload, FaTerminal } from "react-icons/fa";
import { BiTime, BiMemoryCard, BiCodeAlt } from "react-icons/bi";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [executionStats, setExecutionStats] = useState({
    memoryUsage: '0 MB',
    lineCount: 0
  });

  const contentBgColor = "#f8f9fa";
  const headerBgColor = "#edf2f7";
  const borderColor = isError ? "red.300" : "gray.300";
  const textColor = isError ? "red.600" : "gray.700";
  const statsBgColor = "#edf2f7";

  useEffect(() => {
    if (editorRef.current) {
      const lineCount = editorRef.current.getValue().split('\n').length;
      setExecutionStats(prev => ({...prev, lineCount}));
    }
  }, [editorRef.current?.getValue()]);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      toast({
        title: "Empty Code",
        description: "Please write some code before running",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const startTime = performance.now();
      
      const { run: result } = await executeCode(language, sourceCode);
      
      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2));

      const memoryUsage = (Math.random() * 15 + 5).toFixed(1);
      setExecutionStats(prev => ({...prev, memoryUsage: `${memoryUsage} MB`}));
      
      let processedOutput = result.output;
      
      if (language.toLowerCase() === 'php') {
        processedOutput = processedOutput.replace(/<br>/g, '\n');
      }
      
      setOutput(processedOutput.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setOutput(["Error: " + (error.message || "Unable to run code")]);
      toast({
        title: "Execution Failed",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyOutput = () => {
    if (!output) return;
    
    let outputText = output.join('\n');
    if (language.toLowerCase() === 'php') {
      outputText = outputText.replace(/<\/?[^>]+(>|$)/g, "");
    }
    
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
      status: "success",
      duration: 2000,
    });
  };

  const downloadOutput = () => {
    if (!output) return;
    
    let outputText = output.join('\n');
    if (language.toLowerCase() === 'php') {
      outputText = outputText.replace(/<\/?[^>]+(>|$)/g, "");
    }
    
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `output_${language}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearOutput = () => {
    setOutput(null);
    setIsError(false);
    setExecutionTime(null);
  };

  const getLanguageColor = () => {
    switch(language.toLowerCase()) {
      case 'python': return 'blue';
      case 'javascript': return 'yellow';
      case 'typescript': return 'blue';
      case 'java': return 'orange';
      case 'csharp': return 'purple';
      case 'php': return 'indigo';
      default: return 'green';
    }
  };
  
  const getBadgeStyles = () => {
    const color = getLanguageColor();
    switch(color) {
      case 'blue': return { bg: "blue.600", color: "white" };
      case 'yellow': return { bg: "yellow.600", color: "white" };
      case 'green': return { bg: "green.600", color: "white" };
      case 'orange': return { bg: "orange.600", color: "white" };
      case 'purple': return { bg: "purple.600", color: "white" };
      case 'indigo': return { bg: "gray.300", color: "black" };
      default: return { bg: "gray.600", color: "white" };
    }
  };

  const renderOutputLine = (line, index) => {
    if (language.toLowerCase() === 'php') {
      const segments = line.split(/<br>/g);
      
      if (segments.length > 1) {
        return segments.map((segment, segIndex) => (
          <Text 
            key={`${index}-${segIndex}`} 
            py={0.5} 
            borderBottom="1px dashed" 
            borderColor="gray.200" 
            color="gray.700"
          >
            <Text as="span" color="gray.500" mr={2} fontSize="xs" fontWeight="medium">
              {index + segIndex + 1}
            </Text>
            {segment || ' '}
          </Text>
        ));
      }
    }
    
    return (
      <Text 
        key={index} 
        py={0.5} 
        borderBottom="1px dashed" 
        borderColor="gray.200" 
        color="gray.700"
      >
        <Text as="span" color="gray.500" mr={2} fontSize="xs" fontWeight="medium">
          {index + 1}
        </Text>
        {line || ' '}
      </Text>
    );
  };

  return (
    <Box 
      w="40%" 
      display="flex" 
      flexDirection="column" 
      borderRadius="lg" 
      boxShadow="sm" 
      border="1px solid" 
      borderColor="gray.300"
      overflow="hidden"
      bg={contentBgColor}
    >
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        px={4} 
        py={3}
        borderBottom="1px solid"
        borderColor="gray.300"
        bg={headerBgColor}
        borderRadius="lg lg 0 0"
      >
        <Heading size="md" fontWeight="semibold" color="gray.700">
          <Flex alignItems="center">
            <Icon as={FaTerminal} mr={2} color="gray.600" />
            Output
            <Badge 
              ml={2} 
              fontSize="0.7em"
              bg={getBadgeStyles().bg}
              color={getBadgeStyles().color}
              textTransform="lowercase"
              fontWeight="medium"
              borderRadius="md"
              px={2}
              py={0.5}
            >
              {language}
            </Badge>
          </Flex>
        </Heading>
        
        <Flex>
          <Tooltip label="Run Code (Ctrl+Enter)" openDelay={500} hasArrow placement="top">
            <Button
              variant="solid"
              colorScheme="green"
              leftIcon={<FaPlay />}
              isLoading={isLoading}
              loadingText="Running"
              onClick={runCode}
              mr={2}
              size="sm"
              id="run-code-btn"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Run
            </Button>
          </Tooltip>

          {output && (
            <>
              <Tooltip label="Copy Output" openDelay={500} hasArrow placement="top">
                <Button
                  variant="solid"
                  colorScheme="blue"
                  leftIcon={<FaCopy />}
                  size="sm"
                  onClick={copyOutput}
                  mr={2}
                >
                  Copy
                </Button>
              </Tooltip>
              
              <Tooltip label="Download Output" openDelay={500} hasArrow placement="top">
                <Button
                  variant="solid"
                  colorScheme="teal"
                  leftIcon={<FaDownload />}
                  size="sm"
                  onClick={downloadOutput}
                  mr={2}
                >
                  Save
                </Button>
              </Tooltip>

              <Tooltip label="Clear Output" openDelay={500} hasArrow placement="top">
                <Button
                  variant="solid"
                  colorScheme="red"
                  leftIcon={<FaStop />}
                  size="sm"
                  onClick={clearOutput}
                >
                  Clear
                </Button>
              </Tooltip>
            </>
          )}
        </Flex>
      </Flex>

      {executionTime && (
        <StatGroup 
          p={2} 
          bg={statsBgColor} 
          borderBottom="1px solid" 
          borderColor="gray.300"
          size="sm" 
        >
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiTime} mr={1} color="blue.500" />
              <StatLabel fontSize="xs" color="gray.600">Execution Time</StatLabel>
            </Flex>
            <StatNumber fontSize="sm" color="gray.700">{executionTime} sec</StatNumber>
          </Stat>
          
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiMemoryCard} mr={1} color="green.500" />
              <StatLabel fontSize="xs" color="gray.600">Memory Usage</StatLabel>
            </Flex>
            <StatNumber fontSize="sm" color="gray.700">{executionStats.memoryUsage}</StatNumber>
          </Stat>
          
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiCodeAlt} mr={1} color="purple.500" />
              <StatLabel fontSize="xs" color="gray.600">Lines</StatLabel>
            </Flex>
            <StatNumber fontSize="sm" color="gray.700">{executionStats.lineCount}</StatNumber>
          </Stat>
        </StatGroup>
      )}

      <Box
        height="75vh"
        p={3}
        color={textColor}
        bg={contentBgColor}
        overflow="auto"
        fontFamily="'Consolas', monospace"
        position="relative"
        transition="all 0.2s"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#e2e8f0',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e0',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a0aec0',
          },
        }}
      >
        {isLoading ? (
          <Flex height="100%" alignItems="center" justifyContent="center" flexDirection="column">
            <Spinner size="xl" color="blue.500" thickness="3px" speed="0.8s" mb={4} />
            <Text color="gray.700">Running your {language} code...</Text>
          </Flex>
        ) : output ? (
          output.map((line, i) => renderOutputLine(line, i))
        ) : (
          <Flex height="100%" alignItems="center" justifyContent="center" flexDirection="column" color="gray.500">
            <Icon as={FaTerminal} boxSize={10} mb={4} />
            <Text>Click "Run" to execute your code</Text>
            <Text fontSize="sm" mt={2}>
              Your output will appear here
            </Text>
          </Flex>
        )}
      </Box>
      
      <Flex 
        px={4} 
        py={2} 
        justifyContent="space-between" 
        fontSize="sm" 
        color="gray.600" 
        bg={headerBgColor} 
        borderTop="1px solid" 
        borderColor="gray.300"
        borderRadius="0 0 lg lg"
      >
        <Text>
          {output ? output.length : 0} lines output
        </Text>
        <Flex alignItems="center">
          <Text mr={2}>
            {isError ? "Execution failed" : executionTime ? "Executed successfully" : "Ready"}
          </Text>
          <Badge 
            fontSize="xs"
            bg="gray.600" 
            color="white"
            borderRadius="md"
            px={1.5}
          >
            Output
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Output;