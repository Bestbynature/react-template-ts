import { createSlice, 
  createAsyncThunk, 
  isRejectedWithValue,
  PayloadAction
 } from '@reduxjs/toolkit';
//  import type { RootState } from '../store';
import axios from 'axios';

// const url = process.env.REACT_APP_API_ENDPOINT;
const url="";

// if (!url) {
//   throw new Error('REACT_APP_API_ENDPOINT is not defined.');
// }

export const fetchBlogs = createAsyncThunk('posts/fetchblog',   async () => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return isRejectedWithValue(error.response.data);
    }
  }
);

export const postBlog = createAsyncThunk('posts/postBlog', async (formData: blogState) => {
  try {
    const response = await axios.post(url, formData);
    return response.data;
  } catch (error: any) {
    return isRejectedWithValue(error.response.data);
  }
});

export const deleteBlog = createAsyncThunk('posts/deleteBlog', async (index: number) => {
  try {
    const response = await axios.delete(`${url}/${index}`);
    return response.data;
  } catch (error: any) {
    return isRejectedWithValue(error.response.data);
  }
});

export const updateBlog = createAsyncThunk('posts/updateBlog', async (formData: blogState) => {
  try {
    const response = await axios.put(`${url}/${formData.id}`, formData);
    return response.data;
  } catch (error: any) {
    return isRejectedWithValue(error.response.data);
  }
});

export interface blogState {
  guid: string;
  id: number;
  title: string;
  category: string;
  author: string;
  dateCreated: string;
  dateUpdated: string;
}

interface AppState {
  blogs: blogState[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  user: string | null;

}

const initialState: AppState = {
  blogs: [],
  status: 'idle',
  error: null,
  user: null
};

const blogSlice = createSlice({
  name: 'blogService',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string | null | undefined>) => {
      return { ...state, user: action.payload || null };
    }
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state: AppState) => {
        return { ...state, status: 'loading' };
      })
      .addCase(fetchBlogs.fulfilled, (state: AppState, action: PayloadAction<blogState[]>) => {
        return { ...state, status: 'succeeded', posts: action.payload };
      })
      .addCase(postBlog.pending, (state: AppState) => {
        return { ...state, status: 'loading' };
      })
      .addCase(postBlog.fulfilled, (state: AppState, action: PayloadAction<blogState>) => {
        return { ...state, status: 'succeeded', posts: [...state.blogs, action.payload] };
      })
      .addCase(deleteBlog.pending, (state: AppState) => {
        return { ...state, status: 'loading' };
      })
      .addCase(deleteBlog.fulfilled, (state: AppState ) => {
        return { ...state, status: 'succeeded'};
      })
   } 
});


/**
 * export const selectCount = (state: RootState) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };
 */

export const { setUser } = blogSlice.actions;
export default blogSlice.reducer;