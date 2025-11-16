import {TopMessageAlerts, ConfirmAlert, Alert} from "@/components/MessageAlert";
import { useState } from "react";

export const TestAlert = () =>{
const [alert, setAlert] = useState<any>(null);
const [show, setShow] = useState(false);

  const showAlert = (type: any) => {
    setAlert({
      id: Date.now().toString(),
      text: `${type.toUpperCase()} alert example`,
      type,
    });
  };
const alertmeg = {
    id: Date.now().toString(),
    title: "Success alert example",
    message: "This is a success alert example.",
    type: "error" as "error",
    onCancel: () => setShow(false),
  }
  return (
    <div className="relative overflow-x-hidden h-screen flex flex-col items-center justify-center gap-3">
      <button onClick={() => showAlert("success")} className="bg-green-500 text-white px-3 py-2 rounded">
        Success
      </button>
      <button onClick={() => showAlert("warning")} className="bg-yellow-500 text-white px-3 py-2 rounded">
        Warning
      </button>
      <button onClick={() => showAlert("error")} className="bg-red-500 text-white px-3 py-2 rounded">
        Error
      </button>
      <TopMessageAlerts message={alert} onClose={() => setAlert(null)} position="bottom" positionValue="2%"/>

        <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
        onClick={() => setShow(true)}
      >
        Delete User
      </button>

      {/* {show && (
        <ConfirmAlert
          title="Delete this user?"
          message="This action cannot be undone."
          onConfirm={() => {
            console.log("User deleted!");
            setShow(false);
          }}
          onCancel={() => setShow(false)}
        />
      )} */}

      {show && (
        <Alert
        alert={alertmeg} position="right" positionValue={190}
        />
      )}

    </div>
  );
}