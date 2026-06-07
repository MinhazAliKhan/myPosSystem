const { z } = require("zod");

const registerSchema = z.object({
  userName: z.string().min(2, "Name too short"),
  email: z.string().email(),
  phone: z.string().min(10, "Phone invalid"),
  password: z.string().min(6, "Password too short"),
  role: z.enum(["ADMIN","MANAGER","SALESMAN"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema
};
