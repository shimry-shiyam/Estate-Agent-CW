import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../components/SearchForm';
import '@testing-library/jest-dom';

// TEST 1: Search Form
test('renders search form elements', () => {
    render(<SearchForm onSearch={() => { }} />);
    // Check if the "Type" label exists
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    // Check if the button exists
    expect(screen.getByRole('button', { name: /Search Properties/i })).toBeInTheDocument();
});

// TEST 2: Type dropdown
test('allows user to change property type', () => {
    render(<SearchForm onSearch={() => { }} />);
    const selectBox = screen.getByRole('combobox', { name: /Type/i }); // Finds the dropdown

    fireEvent.change(selectBox, { target: { value: 'Flat' } });

    expect(selectBox.value).toBe('Flat');
});

// TEST 3: Search button function
test('calls onSearch when button is clicked', () => {
    const mockSearch = jest.fn(); // Create a fake function spy
    render(<SearchForm onSearch={mockSearch} />);

    const button = screen.getByRole('button', { name: /Search Properties/i });
    fireEvent.click(button);

    expect(mockSearch).toHaveBeenCalledTimes(1);
});

// TEST 4: Filter logic
test('filter logic correctly identifies matching properties', () => {
    const mockProperties = [
        { id: 1, type: 'House', price: 100000 },
        { id: 2, type: 'Flat', price: 100000 }
    ];

    const criteria = { type: 'House', minPrice: 0, maxPrice: 200000 };

    const results = mockProperties.filter(p => p.type === criteria.type);

    expect(results.length).toBe(1);
    expect(results[0].type).toBe('House');
});

// TEST 5: Price range filter
test('filter logic respects price range', () => {
    const mockProperties = [
        { id: 1, price: 500 },
        { id: 2, price: 5000000 }
    ];

    const criteria = { minPrice: 0, maxPrice: 1000 };

    const results = mockProperties.filter(p => p.price <= criteria.maxPrice);

    expect(results.length).toBe(1);
    expect(results[0].price).toBe(500);
});