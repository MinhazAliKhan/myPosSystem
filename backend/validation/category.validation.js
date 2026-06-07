const {z}=require("zod");
const mongoose=require('mongoose');

const objectId=(msg)=>z.string().refine((val)=>mongoose.Types.ObjectId.isValid(val),
    {
        message:msg,
    }
);
const createCategorySchema=z.object({
    name:z.string().trim().min(2,"Name must be at least 2 characters")
    .max(50,'Name must be atleast 50 characters'),
    description:z.string().trim().max(500,"description can not be exceed 500 character"),
    isActive:z.boolean().optional(),
});

const updateCategorySchema=createCategorySchema.partial();

const categoryIdParamSchema=z.object({
    id:objectId("InvalidID"),
});

module.exports={createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema
};