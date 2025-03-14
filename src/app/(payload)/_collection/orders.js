/** @type {import('payload/types').CollectionConfig} */
const Orders = {
  slug: "orders",
  admin: {
    useAsTitle: "status",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (
          operation === "read" ||
          operation === "update" ||
          operation === "delete"
        ) {
          const { req } = args;
          const { getSession } = await import("next-auth/react");
          const session = await getSession({ req });
          console.log("NextAuth session in hook (Orders):", session);
          if (session) {
            req.user = session.user;
          }
        }
        return args;
      },
    ],
    beforeChange: [
      ({ data, req }) => {
        if (!data.createdAt) {
          data.createdAt = new Date();
        }
        if (!data.user && req.user) {
          data.user = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      label: "User",
    },
    {
      name: "products",
      type: "array",
      label: "Products in Order",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          label: "Product",
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          label: "Quantity",
          min: 1,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      label: "Order Status",
      options: [
        { label: "Not Confirmed", value: "not_confirmed" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
      ],
      defaultValue: "not_confirmed",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "totalAmount",
      type: "number",
      label: "Total Amount",
      required: true,
      min: 0,
    },
    {
      name: "createdAt",
      type: "date",
      label: "Created At",
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date(),
    },
  ],
};

export default Orders;
