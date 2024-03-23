import { ObjectId } from "mongodb";
import { Collections } from "../../../../app.js"
import jwt from "jsonwebtoken";

    const login = async (req, res) => {
      const user = req.body;
      const userDoc = await Collections.adminsCollection.findOne({ userName: user.username });
      console.log(userDoc)
      if (userDoc) {
        console.log(1)
        if(userDoc.password !== user.password){
          console.log(2)
          return res.status(400).json({ success: false, message: "Wrong Password" });
        }else{
          console.log(3)
          const token = jwt.sign(user, 'shhhh', { expiresIn: '1h' });
          res.send({ token: token, userRole: userDoc.role });
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found" });
      }
    };
    const createAdmin = async (req, res) => {
      const body = req.body;
      const {fullName, userName, password, confirmPassword } = body;
      if (password !== confirmPassword) {
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
    const deleteAdmin = async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      //Update totalCount of the respective product category
      const result = await Collections.adminsCollection.deleteOne(query)
      res.send(result)
    };
    
export const AdminController = { login, getAdmins, createAdmin, deleteAdmin };
