const orders = [
  {
    id: 1,
    customerId: "C001",
    status: "completed",
    items: [
      { productId: "P1", quantity: 2, price: 10 },
      { productId: "P2", quantity: 1, price: 20 },
    ],
  },
  {
    id: 2,
    customerId: "C002",
    status: "completed",
    items: [
      { productId: "P1", quantity: 1, price: 10 },
      { productId: "P3", quantity: 3, price: 15 },
      { productId: "P2", quantity: 2, price: 15 },
    ],
  },
  {
    id: 3,
    customerId: "C001",
    status: "cancelled",
    items: [{ productId: "P2", quantity: 5, price: 20 }],
  },
  {
    id: 4,
    customerId: "C001",
    status: "completed",
    items: [
      { productId: "P1", quantity: 3, price: 10 },
      { productId: "P3", quantity: 2, price: 15 },
      { productId: "P2", quantity: 2, price: -15 },
    ],
  },
];

const analyzeOrders = () => {
  let customers = {};
  let products = {};
  let totalRevenue = 0;
  const filteredOrders = orders.filter((order) => order.status === "completed");
  for (const order of filteredOrders) {
    if (!customers[order.customerId]) {
      customers[order.customerId] = {
        totalSpent: 0,
        orderCount: 0,
      };
    }
    let total = 0;
    for (const item of order.items) {
      if (item.price < 0) continue;
      total += item.quantity * item.price;
      if (!products[item.productId]) {
        products[item.productId] = {
          quantitySold: 0,
          revenue: 0,
        };
      }
      products[item.productId].quantitySold += item.quantity;
      products[item.productId].revenue += item.quantity * item.price;
    }
    customers[order.customerId].totalSpent += total;
    customers[order.customerId].orderCount += 1;
    totalRevenue += total;
  }
  const output = { customers, products, totalRevenue };
  console.log(output);
  return output;
};

const getTopSellingProduct = (data) => {
  let maxRevenue = 0;
  let maxProd = null;
  for (const [key, value] of Object.entries(data.products)) {
    if (maxRevenue < value.revenue) {
      maxProd = key;
      maxRevenue = value.revenue;
    }
  }
  console.log("top", maxProd);
  return maxProd;
};

const getAvgProdValue = (data) => {
  const products = data.products;
  const total = Object.values(products).reduce(
    (sum, val) => (sum += val.revenue),
    0,
  );
  const avg = (total / Object.values(products).length).toFixed(2);
  console.log(avg);
  return avg;
};

const getCustomerByMinSpend = (data, minSpend) => {
  let customers = [];
  for (const [key, value] of Object.entries(data.customers)) {
    if (value.totalSpent > minSpend) customers.push(key);
  }
  console.log(customers);
  return customers;
};

const analysedData = analyzeOrders();
const topProduct = getTopSellingProduct(analysedData);
const averageProdValue = getAvgProdValue(analysedData);
const amountBasedCustomer = getCustomerByMinSpend(analysedData, 60);
