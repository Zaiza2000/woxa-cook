import { db } from "./firebase";
import { ref, onValue, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [orderArray, setOrderArray] = useState([]);
  const [showStatus, setShowstatus] = useState("");

  //read
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setOrderArray([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((order) => {
          setOrderArray((oldArray) => [...oldArray, order]);
        });
      }
    });
  }, []);

  async function finishedOrder(userId, order) {
    try {
      await axios.post("https://woxa-food-order.herokuapp.com/finished-order", {
        id: userId,
        order: order,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function rejectOrder(userId, order) {
    try {
      await axios.post("https://woxa-food-order.herokuapp.com/reject-order", {
        id: userId,
        order: order,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //todo:delete order in database
  const handleDelete = (order) => {
    remove(ref(db, `/${order.id}`));
  };

  //No.
  var orderNo = 0;

  //showstatus
  const toggleShowStatus = () => {
    setShowstatus(!showStatus);
  };
  return (
    <section className="overflow-x-auto">
      <h1 className="m-10 text-lg text-center font-bold">WOXA KITCHEN</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-sm text-white uppercase bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                คิวที่
              </th>
              <th scope="col" className="px-6 py-3">
                ชื่อผู้สั่ง
              </th>
              <th scope="col" className="px-6 py-3">
                เมนูที่สั่ง
              </th>
              <th scope="col" className="px-6 py-3">
                ตรวจสอบ
              </th>
              <th scope="col" className="px-6 py-3">
                สถานะ
              </th>
            </tr>
          </thead>
          <tbody>
            {orderArray.map((order, index) => (
              <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {++orderNo}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {" "}
                  {order.name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {order.order}
                </td>
                <td className="font-medium ">
                  <button
                    className="py-2 px-5 bg-green-500 hover:bg-green-400 text-white rounded-lg mt-2 mr-10"
                    onClick={() => { finishedOrder(order.id, order.order); toggleShowStatus(); }}
                  >
                    เสร็จแล้ว
                  </button>
                  <button
                    className="py-2 px-5 bg-red-600 hover:bg-red-400 text-white rounded-lg mr-10"
                    onClick={() => { rejectOrder(order.id, order.order); toggleShowStatus(); }}
                  >
                    ไม่มีเมนูนี้
                  </button>

                </td>
                <td className="font-medium ">
                  <div className="show-status">
                    {showStatus === false ? (
                      <span className="bg-white rounded-md px-2">
                      </span>
                    ) : (
                      <span className="bg-green-200 text-green-900  rounded-md px-2">
                        เสร็จแล้ว
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
