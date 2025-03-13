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
  hooks: {
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
};

export default Orders;
