import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userState = {
  updateState: false,
  loading: false,
  usersList: [],
  error: "",
  response: "",
};

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
});

export const addUser = createAsyncThunk("user/addUser", async (data) => {
  const { name, email } = data;
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/users",
    {
      name,
      email,
    }
  );
  return response.data;
});

export const removeUser = createAsyncThunk("user/removeUser", async (data) => {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/users/${data}`
  );
  return (response.data = data);
});

export const modifiedUser = createAsyncThunk(
  "user/modifiedUser",
  async (data) => {
    const { name, email, id } = data;
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      {
        name,
        email,
      }
    );
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    changeStateTrue: (state) => {
      state.updateState = true;
    },
    changeStateFalse: (state) => {
      state.updateState = false;
    },
    clearResponse: (state) => {
      state.response = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList.push(action.payload);
        state.response = "add";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.usersList = state.usersList.filter(
        (item) => item.id !== action.payload
      );
      state.response = "delete";
    });

    builder.addCase(modifiedUser.fulfilled, (state, action) => {
      const updateItem = action.payload;
      console.log(updateItem);
      const index = state.usersList.findIndex(
        (item) => item._id === updateItem._id
      );
      if (index !== -1) {
        state.usersList[index] = updateItem;
      }
      state.response = "update";
    });
  },
});

export default userSlice.reducer;
export const { changeStateTrue, changeStateFalse, clearResponse } =
  userSlice.actions;
