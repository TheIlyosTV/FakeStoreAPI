import { useQuery } from "react-query";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("https://fakestoreapi.com/products/");

  if (!response.ok) {
    throw new Error("Network response was not ok!");
  }
  return response.json();
};

const FakestoreAPI = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[]>("products", fetchProducts);
  const [searchTerm, setsearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [products, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(event.target.value);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-4">
      <form className="mb-10">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
        </div>
      </form>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <li key={product.id} className="border rounded-lg p-4 shadow-lg">
            <img
              src={product.image}
              alt={product.title}
              className="w-[400px] h-[400px] object-cover"
            />
            <h2 className="text-xl font-bold mt-2 mb-[10px]">
              {product.title}
            </h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-lg font-semibold mt-2">${product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FakestoreAPI;
