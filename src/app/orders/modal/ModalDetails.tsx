import Image from "next/image";
import React from "react";
import { Detail } from "../page";

interface ModalDetailsProps {
  details: Detail[];
}

const ModalDetails: React.FC<ModalDetailsProps> = ({ details }) => {
  function multiplication(detail: Detail) {
    const total = detail.price * detail.amount;
    return total;
  }

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Ürünler</h3>
        <div className="py-4 h-auto space-y-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex flex-row space-x-4 border border-rose-300 rounded-md"
            >
              <figure>
                <Image
                  src={detail.image}
                  className="w-28 h-auto"
                  alt="product"
                  width={20}
                  height={20}
                />
              </figure>
              <div className="flex flex-col justify-between">
                <div className="">
                  <h2 className="font-bold text-lg">{detail.name}</h2>
                  <a className="font-normal">{detail.description}</a>
                </div>
                <h2 className="font-semibold text-md">
                  {`${detail.price}₺ x ${detail.amount} = ${multiplication(
                    detail
                  )}₺`}
                </h2>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Kapat</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalDetails;
