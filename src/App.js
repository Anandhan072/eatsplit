import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [addFriendList, setAddFriendList] = useState(initialFriends);
  const [showAddFriend, setAShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleAddNewFriend(friend) {
    setAddFriendList((friends) => [...friends, friend]);
    setAShowAddFriend(false);
  }

  function changeState() {
    setAShowAddFriend((show) => !show);
  }

  function handleSelection(friend) {
    // setSelectFriend(friend);

    setSelectFriend((selected) => (selected?.id === friend.id ? null : friend));
    setAShowAddFriend(false);
  }

  function onSplitBill(value) {
    console.log(value);

    setAddFriendList((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id ? { ...friend, balance: friend.balance + value } : friend
      )
    );
    setSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          listFriends={addFriendList}
          onSelection={handleSelection}
          selectFriend={selectFriend}
        />
        {showAddFriend && <AddFriend onAddFriend={handleAddNewFriend} />}

        <Button onClick={changeState}>{showAddFriend ? "Close" : "Add Friend"}</Button>
      </div>
      {selectFriend && <FormSplitBill splitFriend={selectFriend} onSplitBill={onSplitBill} />}
    </div>
  );
}

function FriendsList({ listFriends, onSelection, selectFriend }) {
  const friends = listFriends;

  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friends
            friend={friend}
            key={friend.id}
            onSelection={onSelection}
            selectFriend={selectFriend}
          />
        );
      })}
    </ul>
  );
}

function Friends({ friend, onSelection, selectFriend }) {
  const isSelected = friend === selectFriend;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance === 0 && <p className="grey">You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function updateFriend(a) {
    a.preventDefault();

    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${img}?u=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={updateFriend}>
      <label htmlFor="fname"> 👫Friend Name</label>
      <input
        type="text"
        id="fname"
        value={name}
        onChange={(a) => setName((s) => (s = a.target.value))}
      />
      <label htmlFor="img_url"> 🌄Image URL</label>
      <input type="text" id="img_url" value={img} onChange={(s) => setImg(s.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ splitFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const billExpense = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(a) {
    a.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? billExpense : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {splitFriend.name} </h2>
      <label htmlFor="bvalue"> 💰 Bill Value</label>
      <input
        type="number"
        id="bvalue"
        value={bill}
        onChange={(a) => setBill(Number(a.target.value) === 0 ? "" : Number(a.target.value))}
      />
      <label htmlFor="yvalue"> 🧍‍♀️ Your expense</label>
      <input
        type="number"
        id="yvalue"
        value={paidByUser}
        onChange={(a) =>
          setPaidByUser(
            Number(a.target.value) === 0
              ? ""
              : Number(a.target.value) > bill
              ? paidByUser
              : Number(a.target.value)
          )
        }
      />
      <label htmlFor="evalue"> 👫 {splitFriend.name}'s expense</label>
      <input type="number" id="evalue" value={billExpense} disabled />

      <label htmlFor="choses"> Who is paying the bill</label>
      <select
        name=""
        id="choses"
        value={whoIsPaying}
        onChange={(a) => setWhoIsPaying((s) => (s = a.target.value))}
      >
        <option value="user">You</option>
        <option value="friend">{splitFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
