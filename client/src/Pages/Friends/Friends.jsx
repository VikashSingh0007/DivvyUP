import {
    ExclamationIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/outline";
import Tabs from "../../Components/Tabs";
import Breadcrumb from "../../Components/BreadCrumb";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddExpense from "./AddExpense";
import EditMembers from "./EditFriend"
import ExpenseList from "./ExpenseList";
import getUserDeatils from "../../GetData/UserDetails";
import axios from "axios";
import SearchFriend from "../../Components/SearchFriendBox";

const Friends = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openAddExpense, setAddExpense] = useState(false);
    const [title, setTitle] = useState("");
    const [deleteMember, setDeleteMember] = useState("");
    const [expenseList, setExpenseList] = useState([]);
    const [settledExpenseList, setSettledExpenseList] = useState([]);
    const [group, setGroup] = useState({});
    const [friendList, setFriendList] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [Loading, setLoading] = useState(false);
    const [friend, setFriend] = useState();

    useEffect(() => {
        getUserDeatils(setCurrentUser);
    }, [])

    const fetchFriendsById = async (_id) => {
        if (!_id) return;
        setLoading(true);
        const result = await axios.get(`/friends/${_id}`);
        if (result) {
            setFriendList(result.data.friends);
        } else {
            alert("Friend not found", "error");
            navigate("/groups");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser._id) {
            fetchFriendsById(currentUser._id);
        }
    }, [currentUser]);

    const fetchExpenses = async () => {
        const result = await axios.get(`http://localhost:4000/expense/user/${currentUser._id}`);
        if (result) {
            const { activeExpenses, settledExpenses } = result.data;
            if (activeExpenses || settledExpenses) {
                setExpenseList(activeExpenses || []);
                setSettledExpenseList(settledExpenses || []);
            }
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [currentUser]);



    const handleAddMember = async (friendId) => {
        try {
            if (friendId) {
                const result = await axios.post(`http://localhost:4000/friends/${currentUser._id}/friend/${friendId}`);
                if (result) {
                    window.location.reload();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleMemberDelete = async (memberId) => {
        if (memberId) {
            const result = await axios.delete(`http://localhost:4000/friends/${currentUser._id}/friend/${memberId}`);
            if (result) {
                alert("Friend removed", "success");
                fetchFriendsById(currentUser._id);
                setOpen(false);
                window.location.reload();
                return;
            }
        }
        alert("Something went wrong", "error");
    };



    // if (!group._id) return <h1>Loading</h1>;

    return (
        <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
            <div className="flex h-[calc(100vh-64px)] flex-1 flex-col px-4 pt-3  sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
                {/* Page Header */}
                <div>
                    <Breadcrumb
                        paths={[
                            { name: "Friends", to: "/friends" },
                        ]}
                    />
                    <div className="mt-2 flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                {group.name}
                            </h2>
                        </div>
                        {/* <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
                            <Link to={`/friend/${currentUser._id}/addexpense`}>
                                <button className="flex">
                                    <PlusCircleIcon className="w-5 mr-2" />
                                    Add Expense
                                </button>
                            </Link>
                        </div> */}
                        <div className="flex flex-shrink-0 md:mt-0 md:ml-4 md:hidden">
                            <Link to={`/group/${group._id}/addexpense`}>
                                <button>
                                    <PlusCircleIcon className="w-5" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col pt-6 sm:grid sm:h-[calc(100vh-180px)] sm:grid-cols-4 sm:space-x-4">
                    <div className="w-full overflow-y-auto sm:col-span-2">
                        <p className="mb-2 text-sm font-medium uppercase text-gray-500">
                            Expense List
                        </p>
                        <Tabs
                            tabs={[
                                {
                                    label: "Active",
                                    content: (
                                        <ExpenseList currentUser={currentUser} expenseList={expenseList} />
                                    ),
                                },
                                {
                                    label: "Settled",
                                    content: (
                                        <ExpenseList currentUser={currentUser} expenseList={settledExpenseList} settled />
                                    ),
                                },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col justify-start sm:col-span-2">
                        <div className="my-2">
                            <p className="text-sm font-medium uppercase text-gray-500">
                                Add Friend
                            </p>
                            <SearchFriend
                                memberList={friendList}
                                setMemberList={setFriendList}
                                handleAdd={handleAddMember}
                            />
                        </div>
                        <div className="my-2 rounded border shadow-sm ">
                            <p className=" rounded-t bg-gray-800 p-2 text-sm font-semibold uppercase text-white">
                                Friends
                            </p>
                            <div className="divide-y-2 p-2">
                                {(Loading ? <p>Loading</p> : friendList &&
                                    friendList.length > 0 &&
                                    friendList.map((member) => (
                                        <div
                                            key={member._id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="mt-1 text-sm font-semibold text-gray-700 ">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-gray-600">{member.email}</p>
                                            </div>
                                            <div>
                                            </div>
                                            <div className="flex">
                                                <PlusCircleIcon
                                                    className="cursor-pointer w-5 text-green mr-8"
                                                    onClick={() => {
                                                        setAddExpense(true);
                                                        setFriend(member._id);
                                                        // setTitle(`Remove ${member.name}`);
                                                        // setDeleteMember(member._id);
                                                    }}
                                                />
                                                <TrashIcon
                                                    className="cursor-pointer w-5 text-red-600"
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setTitle(`Remove ${member.name}`);
                                                        setDeleteMember(member._id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )))}
                            </div>
                        </div>
                        {/* <div className="my-2 mt-6 rounded border-2 border-dashed border-red-200 p-2 shadow-sm">
                            <p className="text-sm font-semibold uppercase text-red-600">
                                Danger Zone
                            </p>

                            <Button
                                type="secondaryDanger"
                                width="w-full"
                                margin="mt-4"
                                onClick={() => setOpenDeleteModal(true)}
                            >
                                Delete Group
                            </Button>
                        </div> */}
                    </div>
                </div>
                <AddExpense
                    open={openAddExpense}
                    setOpen={setAddExpense}
                    currentUser={currentUser}
                    friend={friend}
                />
                <EditMembers
                    title={title}
                    memberId={deleteMember}
                    icon={<ExclamationIcon className="w-5 text-red-600" />}
                    open={open}
                    setOpen={setOpen}
                    text="Are you sure you want to delete this member?"
                    buttonText="Delete"
                    buttonType="danger"
                    handleDelete={handleMemberDelete}
                />
            </div>
        </div>
    );
};

export default Friends;
