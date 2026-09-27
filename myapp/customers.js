const customers = [
  { id: "C001", name: "Alice", country: "SG" },
  { id: "C002", name: "Bob", country: "MY" },
  { id: "C003", name: "Charlie", country: "SG" },
  { id: "C004", name: "David", country: "ID" },
];

const orders = [
  {
    id: "O001",
    customerId: "C001",
    status: "completed",
    createdAt: "2026-09-01",
    items: [
      { productId: "P1", quantity: 2, price: 10 },
      { productId: "P2", quantity: 1, price: 25 },
    ],
  },
  {
    id: "O002",
    customerId: "C002",
    status: "completed",
    createdAt: "2026-09-02",
    items: [{ productId: "P1", quantity: 3, price: 10 }],
  },
  {
    id: "O003",
    customerId: "C001",
    status: "cancelled",
    createdAt: "2026-09-03",
    items: [{ productId: "P3", quantity: 5, price: 20 }],
  },
  {
    id: "O004",
    customerId: "C003",
    status: "completed",
    createdAt: "2026-09-04",
    items: [
      { productId: "P2", quantity: 2, price: 25 },
      { productId: "P3", quantity: 1, price: 20 },
    ],
  },
  {
    id: "O005",
    customerId: "C001",
    status: "completed",
    createdAt: "2026-09-05",
    items: [
      { productId: "P1", quantity: 1, price: 10 },
      { productId: "P3", quantity: 2, price: 20 },
    ],
  },
  {
    id: "O006",
    customerId: "C999",
    status: "completed",
    createdAt: "2026-09-06",
    items: [{ productId: "P1", quantity: 10, price: 10 }],
  },
];

async function generateReport() {
  try {
    const [customers, orders] = await Promise.all([
      fetchCustomers(),
      fetchOrders(),
    ]);

    // console.log(customers);
    // console.log(orders);
    let orderCount = {};
    let totalSpent = {};

    let customersData = [];
    let productsData = {};
    const filteredOrder = orders.filter(
      (order) => order.status === "completed",
    );

    for (const order of filteredOrder) {
      const customerExists = customers.some(
        (customer) => customer.id === order.customerId,
      );

      if (!customerExists) {
        continue;
      }

      if (!orderCount[order.customerId]) {
        orderCount[order.customerId] = 0;
      }
      if (!totalSpent[order.customerId]) {
        totalSpent[order.customerId] = 0;
      }
      let total = 0;
      for (const item of order.items) {
        if (item.price < 0) continue;
        total += item.quantity * item.price;

        if (!productsData[item.productId]) {
          productsData[item.productId] = { quantitySold: 0, revenue: 0 };
        }
        productsData[item.productId].quantitySold += item.quantity;
        productsData[item.productId].revenue += item.quantity * item.price;
      }
      orderCount[order.customerId] += 1;
      totalSpent[order.customerId] += total;
      //   console.log(total);
    }

    for (const customer of customers) {
      const cusData = {
        id: customer.id,
        name: customer.name,
        country: customer.country,
        orderCount: orderCount[customer.id] ?? 0,
        totalSpent: totalSpent[customer.id] ?? 0,
      };
      customersData.push(cusData);
    }

    const totalOrders = filteredOrder.filter((ord) =>
      customersData.some((c) => c.id === ord.customerId),
    ).length;
    const totalRevenue = Object.values(productsData).reduce(
      (sum, q) => (sum += q.revenue),
      0,
    );
    const averageOrderValue =
      totalOrders === 0 ? 0 : (totalRevenue / totalOrders).toFixed(2);
    let maxQuantity = 0;
    let maxProd = null;
    for (const [key, value] of Object.entries(productsData)) {
      if (maxQuantity < value.quantitySold) {
        maxQuantity = value.quantitySold;
        maxProd = key;
      }
    }
    let maxOrder = 0;
    let maxCust = null;
    for (const cust of customersData) {
      if (maxOrder < cust.orderCount) {
        console.log(cust);
        maxOrder = cust.orderCount;
        maxCust = cust;
      }
    }
    const output = {
      customers: customersData,
      products: productsData,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topProduct: maxProd,
      topCustomer: maxCust,
    };
    console.log(output);
    return output;
  } catch (err) {
    console.error("PROBLEM WITH FETCHING DATA AAAAAAAHHH");
  }
}

const fetchCustomers = () => {
  return new Promise((res) => setTimeout(() => res(customers), 50));
};

const fetchOrders = () => {
  return new Promise((res) => setTimeout(() => res(orders), 50));
};

generateReport();
