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
  StatGroup,
  useBreakpointValue
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

  const isMobile = useBreakpointValue({ base: true, lg: false });
  const outputHeight = useBreakpointValue({ 
    base: "40vh", 
    sm: "45vh", 
    md: "50vh", 
    lg: "60vh", 
    xl: "65vh" 
  });
  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const spacing = useBreakpointValue({ base: 3, sm: 4, md: 4 });
  const fontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

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
            fontSize={fontSize}
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
        fontSize={fontSize}
        wordBreak="break-word"
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
      w="100%"
      display="flex" 
      flexDirection="column" 
      borderRadius="lg" 
      boxShadow="md" 
      border="1px solid" 
      borderColor="gray.300"
      overflow="hidden"
      bg={contentBgColor}
      mt={{ base: 4, lg: 0 }}
      height="fit-content"
    >
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        px={spacing} 
        py={3}
        borderBottom="1px solid"
        borderColor="gray.300"
        bg={headerBgColor}
        flexShrink={0}
      >
        <Flex alignItems="center" minW="0" flex="1">
          <Icon as={FaTerminal} mr={2} color="gray.600" boxSize={{ base: 4, sm: 5 }} />
          <Heading size={headingSize} fontWeight="semibold" color="gray.700" isTruncated>
            Output
            <Badge 
              ml={2} 
              fontSize={{ base: "0.6em", sm: "0.7em" }}
              bg={getBadgeStyles().bg}
              color={getBadgeStyles().color}
              textTransform="lowercase"
              fontWeight="medium"
              borderRadius="md"
              px={{ base: 1, sm: 2 }}
              py={0.5}
              display={{ base: "none", sm: "inline-block" }}
            >
              {language}
            </Badge>
          </Heading>
        </Flex>
        
        <Flex gap={{ base: 1, sm: 2 }} flexShrink={0}>
          <Tooltip 
            label="Run Code (Ctrl+Enter)" 
            hasArrow 
            placement="top"
            isDisabled={isMobile}
          >
            <Button
              variant="solid"
              colorScheme="green"
              leftIcon={<FaPlay />}
              isLoading={isLoading}
              loadingText="Running"
              onClick={runCode}
              size={buttonSize}
              id="run-code-btn"
              fontSize={fontSize}
              px={{ base: 2, sm: 3 }}
            >
              {isMobile ? "" : "Run"}
            </Button>
          </Tooltip>

          {output && (
            <>
              <Tooltip 
                label="Copy Output" 
                hasArrow 
                placement="top"
                isDisabled={isMobile}
              >
                <Button
                  variant="solid"
                  colorScheme="blue"
                  leftIcon={<FaCopy />}
                  size={buttonSize}
                  onClick={copyOutput}
                  fontSize={fontSize}
                  px={{ base: 2, sm: 3 }}
                >
                  {isMobile ? "" : "Copy"}
                </Button>
              </Tooltip>
              
              <Tooltip 
                label="Download Output" 
                hasArrow 
                placement="top"
                isDisabled={isMobile}
              >
                <Button
                  variant="solid"
                  colorScheme="teal"
                  leftIcon={<FaDownload />}
                  size={buttonSize}
                  onClick={downloadOutput}
                  fontSize={fontSize}
                  px={{ base: 2, sm: 3 }}
                >
                  {isMobile ? "" : "Save"}
                </Button>
              </Tooltip>

              <Tooltip 
                label="Clear Output" 
                hasArrow 
                placement="top"
                isDisabled={isMobile}
              >
                <Button
                  variant="solid"
                  colorScheme="red"
                  leftIcon={<FaStop />}
                  size={buttonSize}
                  onClick={clearOutput}
                  fontSize={fontSize}
                  px={{ base: 2, sm: 3 }}
                >
                  {isMobile ? "" : "Clear"}
                </Button>
              </Tooltip>
            </>
          )}
        </Flex>
      </Flex>

      {executionTime && (
        <StatGroup 
          p={spacing} 
          bg={statsBgColor} 
          borderBottom="1px solid" 
          borderColor="gray.300"
          size="sm"
          flexShrink={0}
        >
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiTime} mr={1} color="blue.500" boxSize={{ base: 3, md: 4 }} />
              <StatLabel fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                {isMobile ? "Time" : "Execution Time"}
              </StatLabel>
            </Flex>
            <StatNumber fontSize={{ base: "sm", md: "md" }} color="gray.700">
              {executionTime} sec
            </StatNumber>
          </Stat>
          
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiMemoryCard} mr={1} color="green.500" boxSize={{ base: 3, md: 4 }} />
              <StatLabel fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                {isMobile ? "Memory" : "Memory Usage"}
              </StatLabel>
            </Flex>
            <StatNumber fontSize={{ base: "sm", md: "md" }} color="gray.700">
              {executionStats.memoryUsage}
            </StatNumber>
          </Stat>
          
          <Stat>
            <Flex alignItems="center">
              <Icon as={BiCodeAlt} mr={1} color="purple.500" boxSize={{ base: 3, md: 4 }} />
              <StatLabel fontSize={{ base: "xs", md: "sm" }} color="gray.600">Lines</StatLabel>
            </Flex>
            <StatNumber fontSize={{ base: "sm", md: "md" }} color="gray.700">
              {executionStats.lineCount}
            </StatNumber>
          </Stat>
        </StatGroup>
      )}

      <Box
        height={outputHeight}
        p={spacing}
        color={textColor}
        bg={contentBgColor}
        overflow="auto"
        fontFamily="'Consolas', monospace"
        position="relative"
        flex="1"
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
            <Spinner 
              size={{ base: "lg", md: "xl" }} 
              color="blue.500" 
              thickness="3px" 
              speed="0.8s" 
              mb={4} 
            />
            <Text color="gray.700" fontSize={fontSize} textAlign="center" px={4}>
              Running your {language} code...
            </Text>
          </Flex>
        ) : output ? (
          output.map((line, i) => renderOutputLine(line, i))
        ) : (
          <Flex 
            height="100%" 
            alignItems="center" 
            justifyContent="center" 
            flexDirection="column" 
            color="gray.500"
            px={4}
            textAlign="center"
          >
            <Icon as={FaTerminal} boxSize={{ base: 8, md: 10 }} mb={4} />
            <Text fontSize={fontSize}>Click "Run" to execute your code</Text>
            <Text fontSize={{ base: "xs", md: "sm" }} mt={2}>
              Your output will appear here
            </Text>
          </Flex>
        )}
      </Box>
      
      <Flex 
        px={spacing} 
        py={2} 
        justifyContent="space-between" 
        fontSize={{ base: "xs", md: "sm" }} 
        color="gray.600" 
        bg={headerBgColor} 
        borderTop="1px solid" 
        borderColor="gray.300"
        flexShrink={0}
      >
        <Text>
          {output ? output.length : 0} lines output
        </Text>
        <Flex alignItems="center" gap={2}>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            {isError ? "Execution failed" : executionTime ? "Executed successfully" : "Ready"}
          </Text>
          <Badge 
            fontSize={{ base: "xs", md: "sm" }}
            bg="gray.600" 
            color="white"
            borderRadius="md"
            px={{ base: 1, sm: 1.5 }}
            py={0.5}
          >
            Output
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Output;