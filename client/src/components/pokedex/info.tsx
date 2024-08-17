import { Flex, Text } from '@chakra-ui/react';
import { Pokemon } from 'types/api-responses';
import { capitalize } from 'lib/utils';
import styles from './info.module.scss';

const Info = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <Flex direction="column" gap="2px">
      <Text className={styles.infoText} fontWeight="800">
        {capitalize(pokemon.name)}
      </Text>
      <Text className={styles.infoText}>{`#${pokemon.id}`}</Text>
      <Text className={styles.infoText}>Types:</Text>
      {pokemon.types.map((type) => (
        <Text key={type.type.name} className={styles.typeContainer}>
          {capitalize(type.type.name)}
        </Text>
      ))}
    </Flex>
  );
};

export default Info;
