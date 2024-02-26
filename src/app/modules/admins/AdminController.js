import { Collections } from "../../../../app.js"

    const createAdmin = async (req, res) => {
      const body = req.body;
      const {fullName, userName, newPassword, confirmPassword } = body;
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Password and confirm password do not match" });
      }
      try{
        body.role = 'staff'
        const newUser = await Collections.adminsCollection.insertOne(body);

        res.status(201).json({ success: true, message: "New staff uploaded!", newUser });
      } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    
    const getAdmins = async (req, res) => {
      try{
        const cursor = Collections.adminsCollection.find({ role: "staff" })
        const result = await cursor.toArray()
        res.send(result)
      } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    
export const AdminController = { getAdmins, createAdmin };
