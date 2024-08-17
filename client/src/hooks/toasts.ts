import { useToast } from '@chakra-ui/react';

export const useLimitToast = (toast: ReturnType<typeof useToast>) => {
  return (limit: number) => {
    if (toast.isActive('limit-toast')) return;

    toast({
      id: 'limit-toast',
      title: 'Limit Reached',
      description: `You can only capture ${limit} pokemons`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };
}

export const useCaptureToast = (toast: ReturnType<typeof useToast>) => {
  return () => {
    if (toast.isActive('capture-toast')) return;

    toast({
      id: 'capture-toast',
      title: 'Pokemon captured',
      description: 'You have captured a Pokemon',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}

export const useReleaseToast = (toast: ReturnType<typeof useToast>) => {
  return () => {
    if (toast.isActive('release-toast')) return;

    toast({
      id: 'release-toast',
      title: 'Pokemon released',
      description: 'You have released a Pokemon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
}
