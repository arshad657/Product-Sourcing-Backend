import { Collections } from "../../../../app.js"

    const changePassword = async (req, res) => {
      const body = req.body;
      const { newPassword, confirmPassword } = body;
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Password and confirm password do not match" });
      }
      try{
        const filter = { role: "owner" };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            password: newPassword,
            confirmPassword: confirmPassword
          },
        };
        console.log(filter, updateDoc, options)
        const result = await Collections.adminsCollection.updateOne(filter, updateDoc, options);

        res.status(201).json({ success: true, message: "New product uploaded!" });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    
export const PasswordController = { changePassword };
