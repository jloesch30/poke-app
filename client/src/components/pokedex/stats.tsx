import { Flex, Text } from '@chakra-ui/react';
import { Pokemon } from 'types/api-responses';

const StatMap = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  speed: 'Speed',
};

const Stats = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <Flex direction="row" gap="20px">
        {pokemon.stats.map(
          (stat) =>
            stat.stat.name in StatMap && (
              <Flex direction="column" key={stat.stat.name}>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontWeight="800"
                  borderBottom="1px solid"
                  marginBottom="5px"
                >
                  {StatMap[stat.stat.name as keyof typeof StatMap]}
                </Text>
                <Text fontSize="sm" marginBottom="0">
                  {stat.base_stat}
                </Text>
              </Flex>
            ),
        )}
    </Flex>
  );
};

export default Stats;
