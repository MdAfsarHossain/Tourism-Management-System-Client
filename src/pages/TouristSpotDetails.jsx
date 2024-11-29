import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { LuDollarSign } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { useLoaderData, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const TouristSpotDetails = () => {
  const { _id } = useParams();
  const { user } = useContext(AuthContext);
  const {
    touristsSpotName,
    countryName,
    description,
    averageCost,
    travelTime,
    location,
    imageUrl,
    seasonality,
    totalVisitorsPerYear,
    email,
    name,
  } = useLoaderData();
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch Revies
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews/${_id}`
        );
        setReviews(data);
      } catch (error) {
        toast.error("Failed to fetch reviews");
      }
    };

    fetchReviews();
  }, [reviews]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    const form = e.target;
    const comments = form.review.value;

    const reviewData = {
      _productId: _id,
      comments,
      rating: parseInt(rating),
      reviewerName: user.displayName,
      reviewerEmail: user.email,
    };

    // console.log(`Add Review ${reviews} - ${rating}`, _id);
    // console.log(reviews);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/addReview`,
        reviewData
      );

      if (data.insertedId) {
        toast.success("Review added successfully!");
        form.reset();
        setRating(5);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      // console.log(id);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/review/${id}`
          );
          if (data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your review has been deleted.",
              icon: "success",
            });
            // console.log(id);
          }
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="px-10">
      {/* Summary */}
      <div className="shadow-lg py-5 px-5 rounded-lg flex flex-col lg:flex-row gap-10 justify-between lg:items-center border-2 border-gray-100">
        {/* Details */}
        <div className="flex flex-col gap-3">
          <div className="relative w-fit">
            <h1 className="font-bold text-4xl w-fit border-0">
              {touristsSpotName}
            </h1>
            <p
              className={`hidden md:block absolute bottom-0 -right-28 px-5 rounded-lg text-black font-semibold w-fit ${
                seasonality?.toLowerCase() == "winter"
                  ? "bg-sky-300"
                  : "bg-lime-300"
              }`}
            >
              {seasonality}
            </p>
          </div>
          {/*  */}
          <div className="flex flex-col md:flex-row gap-5 lg:gap-10">
            <div className="">
              <h1 className="font-bold text-lg text-gray-700">Average Cost</h1>
              <div className="flex flex-row justify-start items-center gap-1">
                <LuDollarSign />
                <p className="text-gray-600">{averageCost}</p>
              </div>
            </div>
            <div className="">
              <h1 className="font-bold text-lg text-gray-700">Travel Time</h1>
              <div className="flex flex-row justify-start items-center gap-1">
                <IoTimeOutline />
                <p className="text-gray-600">
                  {travelTime} days {travelTime - 1} nights
                </p>
              </div>
            </div>
            <div className="">
              <h1 className="font-bold text-lg text-gray-700">
                Total Visitors Per Year
              </h1>
              <div className="flex flex-row justify-start items-center gap-1">
                <IoIosPeople />
                <p className="text-gray-600">{totalVisitorsPerYear}</p>
              </div>
            </div>
            <div className="">
              <h1 className="font-bold text-lg text-gray-700">Location</h1>
              <div className="flex flex-row justify-start items-center gap-1">
                <IoLocationOutline />
                <p className="text-gray-600">{location}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Country Name */}
        <div className="">
          <h1 className="text-3xl uppercase text-gray-800 font-semibold">
            Country
          </h1>
          <p className="text-2xl font-bold text-green-500">{countryName}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 text-xl text-justify mb-10">
        <div className="border-b-2 pb-1 mb-2">
          <h1 className="text-3xl font-bold uppercase text-gray-700">
            Description
          </h1>
        </div>
        <h1>{description}</h1>
      </div>

      {/* Image */}
      <div className="w-full">
        <img
          className="w-full object-fill h-96 lg:h-[550px] rounded-lg"
          src={imageUrl}
          alt=""
        />
      </div>

      {/* Author */}
      <div className=" mt-10">
        <div className="border-b-2 pb-1">
          <h1 className="text-3xl font-bold uppercase">Author Info</h1>
        </div>
        <div className="mt-2">
          <div className="flex flex-row justify-start items-center gap-1 font-bold">
            <RiAdminLine />
            <h1 className=""> {name}</h1>
          </div>
          <div className="flex flex-row justify-start items-center gap-1 font-bold ">
            <MdOutlineMail />
            <h1 className="text-gray-700"> {email}</h1>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="mt-10">
        <div className="border-b-2 pb-1 mb-2">
          <h1 className="text-3xl font-bold uppercase">Quick Summary</h1>
        </div>
        <p className="text-xl text-justify">{description}</p>
      </div>

      {/* Map */}
      <div className="mt-10 mb-10">
        <div className="border-b-2 pb-1 mb-2">
          <h1 className="text-3xl font-bold uppercase">Map</h1>
        </div>
        <div className="w-full h-64 rounded-lg overflow-hidden justify-center items-center text-center">
          <h1 className="font-bold">Comming Soon.........</h1>
        </div>
      </div>

      {/* Add Review */}
      <div className="">
        <div className="border-b-2 pb-1 mb-2">
          <h1 className="text-3xl font-bold uppercase">Leave a Review</h1>
        </div>
        <form onSubmit={handleAddReview} className="flex flex-col gap-3">
          {/* Rating */}
          <label htmlFor="name" className="text-xl font-bold mt-3">
            Rating:
          </label>
          <div className="rating rating-lg mb-3">
            <input
              type="radio"
              name="rating-8"
              className="mask mask-star-2 bg-amber-400"
              value="1"
              onChange={handleRatingChange}
              checked={rating === "1"}
            />
            <input
              type="radio"
              name="rating-8"
              className="mask mask-star-2 bg-amber-400"
              // defaultChecked
              value="2"
              onChange={handleRatingChange}
              checked={rating === "2"}
            />
            <input
              type="radio"
              name="rating-8"
              className="mask mask-star-2 bg-amber-400"
              value="3"
              onChange={handleRatingChange}
              checked={rating === "3"}
            />
            <input
              type="radio"
              name="rating-8"
              className="mask mask-star-2 bg-amber-400"
              value="4"
              onChange={handleRatingChange}
              checked={rating === "4"}
            />
            <input
              type="radio"
              name="rating-8"
              className="mask mask-star-2 bg-amber-400"
              value="5"
              onChange={handleRatingChange}
              checked={rating === "5"}
            />
          </div>
          {/* Comments */}
          <label htmlFor="name" className="text-xl font-bold">
            Comments:
          </label>
          <textarea
            required
            name="review"
            placeholder="Write review here..."
            className="textarea textarea-bordered textarea-md w-2/5"
          ></textarea>

          <div className="">
            <button
              type="submit"
              className={`btn bg-green-500 text-white border-2 border-green-500 hover:bg-transparent hover:border-2 hover:border-green-500 hover:text-green-500 transition-all font-bold ${
                user?.email === email ? "hidden" : "block"
              }`}
            >
              Add Review
            </button>
          </div>
        </form>

        {/* <div className="w-full mt-10 h-64 rounded-lg overflow-hidden justify-center items-center text-center">
          <h1 className="font-bold">Comming Soon.........</h1>
        </div> */}
      </div>

      {/* All Reviews */}
      <div className="mt-16 mb-10">
        <div className="border-b-2 pb-1 mb-10">
          <h1 className="text-3xl font-bold uppercase">
            All Reviews: {reviews?.length}
          </h1>
        </div>
        {/* <p>Comming Soon.........</p> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Review 1 */}
          {/* <div className="flex flex-col gap-2 border-2 p-3 rounded-lg">
            <h2 className="text-2xl font-bold">@AfsarHossain</h2>
            <p className="text-lg">
              This is nice place. In my life i never see this type of place.
            </p>
            <p className="text-lg font-bold">5</p>
            <p className="text-3xl">⭐⭐⭐⭐⭐</p>
            <div className="mt-5">
              <button
              onClick={() => handleClick()}
              className="btn bg-red-500 text-white border-2 border-red-500 hover:bg-transparent hover:border-red-500 hover:text-red-500 transition-all">
                Delete
              </button>
            </div>
          </div> */}

          {reviews?.map((review) => {
            return (
              <div
                key={review?._id}
                className="flex flex-col gap-2 border-2 p-3 rounded-lg"
              >
                <h2 className="text-2xl font-bold">@{review?.reviewerName}</h2>
                <p className="text-lg">{review?.comments}</p>
                {/* <p className="text-lg font-bold">{review?.rating}</p> */}
                <p className="text-3xl">
                  {Array(review?.rating)
                    .fill(null)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ⭐
                      </span>
                    ))}
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => handleDeleteReview(review?._id)}
                    className={`btn bg-red-500 text-white border-2 border-red-500 hover:bg-transparent hover:border-red-500 hover:text-red-500 transition-all ${
                      user?.email !== review?.reviewerEmail ? "hidden" : "block"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {/* Review 2 */}
          {/* <div className="border-2 p-3 rounded-lg mt-5">
            <h2>Reviewer Name:</h2>
            <p>Review Title:</p>
            <p>Review Content:</p>
            <p>Review Date:</p>
          </div> */}
        </div>

        {/*  */}
        {/* <div className="w-full h-64 rounded-lg overflow-hidden justify-center items-center text-center">
          <h1 className="font-bold">Comming Soon.........</h1>
        </div> */}
      </div>
    </div>
  );
};

export default TouristSpotDetails;
