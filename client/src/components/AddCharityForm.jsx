import { useForm } from "react-hook-form";

const AddCharityForm = ({ onSave, setShowModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="flex flex-col px-6 max-h-96 overflow-y-scroll"
    >
      {errors.Name && (
        <span className="text-red-400 italic">Name is required</span>
      )}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="text"
        placeholder="Name"
        {...register("Name", { required: true, maxLength: 200 })}
      />
      {errors.Description && (
        <span className="text-red-400 italic">Description is required</span>
      )}
      <textarea
        {...register("Description", { required: true })}
        placeholder="Description"
        rows={4}
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        style={{ minHeight: "100px" }}
      />
      {errors.Email &&
        (errors.Email.type === "required" ? (
          <span className="text-red-400 italic">Email is required</span>
        ) : (
          <span className="text-red-400 italic">Email is not valid</span>
        ))}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="text"
        placeholder="Email"
        {...register("Email", {
          required: true,
          pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i,
        })}
      />
      {errors.MobileNumber &&
        (errors.MobileNumber.type === "required" ? (
          <span className="text-red-400 italic">
            Mobile Number is required
          </span>
        ) : (
          <span className="text-red-400 italic">
            Mobile Number should be less than 12 digits
          </span>
        ))}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="tel"
        placeholder="Mobile Number"
        {...register("MobileNumber", { required: true, maxLength: 12 })}
      />
      {errors.Website &&
        (errors.Website.type === "required" ? (
          <span className="text-red-400 italic">Website is required</span>
        ) : (
          <span className="text-red-400 italic">Website is not valid</span>
        ))}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="text"
        placeholder="Website"
        {...register("Website", {
          required: true,
          pattern:
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i,
        })}
      />
      {errors.PhotoURL &&
        (errors.PhotoURL.type === "required" ? (
          <span className="text-red-400 italic">Photo URL is required</span>
        ) : (
          <span className="text-red-400 italic">Photo URL is not valid</span>
        ))}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="text"
        placeholder="Photo URL"
        {...register("PhotoURL", {
          required: true,
          pattern:
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i,
        })}
      />
      {errors.Address && (
        <span className="text-red-400 italic">Address is required</span>
      )}
      <textarea
        {...register("Address", { required: true })}
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        placeholder="Address"
        style={{ minHeight: "80px" }}
      />
      {errors.Goal && (
        <span className="text-red-400 italic">Goal is required</span>
      )}
      <input
        className="border-gray-300 rounded-md p-2 my-2 border-2"
        type="number"
        placeholder="Goal"
        {...register("Goal", { required: true })}
      />
      {/*footer*/}
      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
        <button
          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleSubmit(onSave)}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AddCharityForm;
