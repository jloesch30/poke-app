/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PokeDex from './page';
import { pokemonFixture } from 'utils/fixtures/pokemon';
import { useToast } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

const renderPokedex = async () => {
  render(
    <MemoryRouter>
      <PokeDex />
    </MemoryRouter>,
  );
};

type ToastMock = ReturnType<typeof vi.fn> & {
  isActive: ReturnType<typeof vi.fn>;
};

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import('@chakra-ui/react')>();

  const toastMock = vi.fn() as ToastMock;
  toastMock.isActive = vi.fn(() => false);

  return {
    ...originalModule,
    useToast: vi.fn(() => toastMock),
  };
});

describe('PokeDex', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders the pokedex', async () => {
    await renderPokedex();

    expect(screen.getByText("Catch 'Em All!")).toBeInTheDocument();
  });

  describe('Searching for a Pokemon', () => {
    it('searches for a pokemon', async () => {
      await renderPokedex();

      const searchInput = screen.getByPlaceholderText('Search for a Pokemon');

      await userEvent.type(searchInput, 'pikachu');
      await userEvent.click(screen.getByText('Go!'));

      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  describe('Capturing a Pokemon', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetModules();
    });

    it('captures a pokemon', async () => {
      await renderPokedex();

      const storageSpy = vi.spyOn(Storage.prototype, 'setItem');

      const searchInput = screen.getByPlaceholderText('Search for a Pokemon');

      await userEvent.type(searchInput, 'pikachu');
      await userEvent.click(screen.getByText('Go!'));

      await userEvent.click(screen.getByText('Capture!'));

      expect(storageSpy).toHaveBeenCalledWith(
        'capturedPokemon',
        JSON.stringify([pokemonFixture]),
      );
    });

    it('notifies the user when a pokemon is captured', async () => {
      const toast = useToast();

      localStorage.setItem(
        'capturedPokemon',
        JSON.stringify(Array(5).fill(pokemonFixture)),
      );

      await renderPokedex();

      const searchInput = screen.getByPlaceholderText('Search for a Pokemon');

      await userEvent.type(searchInput, 'pikachu');
      await userEvent.click(screen.getByText('Go!'));

      await userEvent.click(screen.getByText('Capture!'));

      const expectedToastParams = {
        id: 'capture-toast',
        description: 'You have captured a Pokemon',
        status: 'success',
        duration: 3000,
        isClosable: true,
        title: 'Pokemon captured',
      };

      expect(toast).toHaveBeenNthCalledWith(1, expectedToastParams);
    });

    it('notifies the user when the limit is reached', async () => {
      const toast = useToast();

      localStorage.setItem(
        'capturedPokemon',
        JSON.stringify(Array(6).fill(pokemonFixture)),
      );

      await renderPokedex();

      const searchInput = screen.getByPlaceholderText('Search for a Pokemon');

      await userEvent.type(searchInput, 'pikachu');
      await userEvent.click(screen.getByText('Go!'));

      await userEvent.click(screen.getByText('Capture!'));

      const expectedToastParams = {
        id: 'limit-toast',
        description: 'You can only capture 6 pokemons',
        status: 'error',
        duration: 3000,
        isClosable: true,
        title: 'Limit Reached',
      };

      expect(toast).toHaveBeenNthCalledWith(1, expectedToastParams);
    });
  });

  describe('Releasing a Pokemon', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetModules();
    });

    it('releases a pokemon', async () => {
      localStorage.setItem('capturedPokemon', JSON.stringify([pokemonFixture]));

      await renderPokedex();

      const storageSpy = vi.spyOn(Storage.prototype, 'setItem');

      await userEvent.click(screen.getByAltText('bulbasaur'));

      expect(storageSpy).toHaveBeenCalledWith('capturedPokemon', '[]');
    });

    it('notifies the user when a pokemon is released', async () => {
      const toast = useToast();

      localStorage.setItem('capturedPokemon', JSON.stringify([pokemonFixture]));

      await renderPokedex();

      await userEvent.click(screen.getByAltText('bulbasaur'));

      const expectedToastParams = {
        id: 'release-toast',
        description: 'You have released a Pokemon',
        status: 'info',
        duration: 3000,
        isClosable: true,
        title: 'Pokemon released',
      };

      expect(toast).toHaveBeenNthCalledWith(1, expectedToastParams);
    });
  });
});
