const express = require("express");
const app = express();
const port = 4000;
// const orders = require("./orders");
const orderData = [
  {
    id: 1,
    customerId: 1,
    customer: "Alice",
    amount: 100,
    status: "completed",
  },
  {
    id: 2,
    customerId: 2,
    customer: "Bob",
    amount: 200,
    status: "pending",
  },
  {
    id: 3,
    customerId: 1,
    customer: "Alice",
    amount: 150,
    status: "completed",
  },
];

const nestedUserData = {
  users: [
    {
      name: "Alice",
      orders: [{ amount: 100 }, { amount: 200 }],
    },
    {
      name: "Bob",
      orders: [{ amount: 50 }],
    },
  ],
};

const getTotalOrder = (orders) => {
  //   console.log(typeof orders);
  const total = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => (sum += order.amount), 0);
  return total;
};

const getOrders = (orders, id, completed) => {
  console.log("id ", id, "completed ", completed);
  const newO = orders.filter(
    (order) =>
      order.customerId === id &&
      order.status === (completed ? "completed" : "pending"),
  );
  return newO;
};

const getNestUserTotal = (nestedUser) => {
  const output = {};
  for (const user of nestedUser.users) {
    const total = user.orders.reduce((sum, o) => (sum += o.amount), 0);
    output[user.name] = total;
  }
  return output;
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/hobbies", async (req, res) => {
  const url = "https://coderbyte.com/api/challenges/json/rest-get-simple";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error Bro" });
    }
    const data = await response.json();
    console.log(data);
    const output = data.hobbies.join(", ");
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/orders", (req, res) => {
  const total = getTotalOrder(orderData);
  return res.json({ success: true, data: orderData, totalCompleted: total });
});

app.get("/orders/:id/completed/:completed", (req, res) => {
  const id = parseInt(req.params.id);
  const completed = req.params.completed;
  const ordersForId = getOrders(orderData, id, completed);
  const total = getTotalOrder(ordersForId);
  return res.json({ success: true, data: ordersForId, totalCompleted: total });
});

app.get("/orders-by-user", (req, res) => {
  let output = {};
  for (const order of orderData) {
    if (!output[order.customer]) {
      output[order.customer] = [];
    }
    output[order.customer].push({
      id: order.id,
      amount: order.amount,
      status: order.status,
    });
  }
  const totalPerUser = getNestUserTotal(nestedUserData);
  console.log(totalPerUser);
  return res.json({ success: true, data: output, totalPerUser });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
