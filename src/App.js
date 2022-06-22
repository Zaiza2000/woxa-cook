import { db } from "./firebase";
import { set, ref, onValue, remove, update } from "firebase/database";
import React, { useState, useEffect } from "react";

export default function App() {
  const [order, setOrder] = useState("");
  const [orderArray, setOrderArray] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempId, setTempId] = useState("");
  const [showStatus, setShowstatus] = useState('');
  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

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

  // //write
  // const writeToDatabase = () => {
  //     const id = uid();
  //     set(ref(db, `/${id}`), {
  //         order: order,
  //         id,
  //     });

  //     setOrder("");
  // };

  //update
  const handleUpdate = (order) => {
    setIsEdit(true);
    setTempId(order.id);
    setOrder(order.order);
  };

  const handleSubmitChange = () => {
    update(ref(db, `/${tempId}`), {
      order: order,
      id: tempId,
    });

    setOrder("");
    setIsEdit(false);
  };

  //delete
  const handleDelete = (order) => {
    remove(ref(db, `/${order.id}`));
  };

  //No.
  var orderNo = 0;

  //showstatus
  const toggleShowStatus = () => {
    setShowstatus(!showStatus);
  }
  return (
    <section className="overflow-x-auto">
      <h1 className="m-10 text-lg text-center font-bold">WOXA KITCHEN</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-sm text-white uppercase bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">คิวที่</th>
              <th scope="col" className="px-6 py-3">ชื่อผู้สั่ง</th>
              <th scope="col" className="px-6 py-3">เมนูที่สั่ง</th>
              <th scope="col" className="px-6 py-3">ตรวจสอบ</th>
              <th scope="col" className="px-6 py-3">สถานะ</th>

            </tr>
          </thead>
          <tbody >
            {orderArray.map((order, index) => (
              <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{++orderNo}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"> {order.name}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" >{order.order}</td>
                <td className="font-medium ">
                  <button className="py-2 px-5 bg-green-500 hover:bg-green-400 text-white rounded-lg mt-2 mr-10" onClick={toggleShowStatus}>เสร็จแล้ว</button>
                  <button className="py-2 px-5 bg-red-600 hover:bg-red-400 text-white rounded-lg mr-10" onClick={toggleShowStatus}>ไม่มีเมนูนี้</button>
                </td>
                <td className="font-medium ">
                  <div className="show-status">
                    {showStatus === false ? (
                      <span className="bg-green-200 text-green-900  rounded-md px-2"
                      >เสร็จแล้ว</span>
                    ) : (
                      <span className="bg-red-200 text-red-900 rounded-md px-2"
                      >ยกเลิกแล้ว</span>
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
