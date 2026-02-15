import api from '@/lib/axios'
import { CartItem, CartItemResponse, CartState } from '@/shared/types/cartTypes'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  tempMergeItems: [],
  mergeDialogOpen: false,
  addItemById: {
    isSuccess: false,
    isLoading: false,
    isError: false,
  },
  removeItems: {
    isSuccess: false,
    isLoading: false,
    isError: false,
  },
}

const syncWithLocalStorage = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const mergeCarts = (guestCart: CartItem[], userCart: CartItem[]) => {
  const merged = [...userCart]

  guestCart.forEach((guestItem) => {
    const existing = merged.find((mergedItem) => 
      mergedItem.productId === guestItem.productId
    )
    if (existing) {
      existing.quantity += guestItem.quantity
    } else {
      merged.push(guestItem)
    }
  })
  return merged
}

export const fetchUserCart = createAsyncThunk('cart/fetchUserCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/cart/${userId}`)
      return res.data.items as CartItem[]
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const removeItemCart = createAsyncThunk('cart/removeItemCart',
  async ({ userId, productId }: { userId: string, productId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete(`/cart/${userId}/${productId}`)
      return res.data.items as CartItem[]
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const clearUserCart = createAsyncThunk('cart/clearUserCart',
  async (userId: string
  ) => {
    const res = await api.delete(`/cart/clear/${userId}`)
    return { message: res.data.response }
  }
)

export const addItemById = createAsyncThunk('cart/addItemById',
  async ({userId, itemData }:{
    userId: string, itemData: CartItem }, { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/cart/${userId}`, itemData)
      return { message: res.data.message, item: res.data.item} as CartItemResponse
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const updateItemById = createAsyncThunk('cart/updateItemById',
  async ({ userId, itemData }: { userId: string, itemData: CartItem },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/cart/${userId}`, itemData)
      return res.data.item as CartItem
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      if (action.payload) {
        state.items = action.payload
        syncWithLocalStorage(state.items)
      }
    },
    getCartStorage: (state) => {
      const storedCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
      state.items = storedCart
    },
    updateItemQuantity: (state, action: PayloadAction<{ productId: string, quantity: number }>) => {
      const { productId, quantity } = action.payload
      const cartItem = state.items.find((item) => item.productId === productId)
      if (cartItem) {
        cartItem.quantity = quantity
      }
      syncWithLocalStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      syncWithLocalStorage(state.items)
    },
    resetAddItemById: (state) => {
      state.addItemById.isLoading = false
      state.addItemById.isError = false
      state.addItemById.isSuccess = false
    },
    removeItemCartLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      syncWithLocalStorage(state.items)
    },
    syncCart: (state) => {
      syncWithLocalStorage(state.items)
    },
    showMergeDialog: (state, action: PayloadAction<CartItem[]>) => {
      state.tempMergeItems = action.payload
      state.mergeDialogOpen = true
    },
    confirmMerge: (state) => {
      if (state.tempMergeItems) {
        state.items = mergeCarts(state.tempMergeItems, state.items)
        state.tempMergeItems = null
        state.mergeDialogOpen = false
        syncWithLocalStorage(state.items)
      }
    },
    rejectMerge: (state) => {
      state.tempMergeItems = null
      state.mergeDialogOpen = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        const cart = action.payload
        if (cart) {
          state.items = cart
        }
        syncWithLocalStorage(state.items)
      })
      .addCase(addItemById.pending, (state) => {
        state.addItemById.isLoading = true
        state.addItemById.isError = false
        state.addItemById.isSuccess = false
      })
      .addCase(addItemById.fulfilled, (state, action) => {
        if (action.payload) {
          const { item } = action.payload

          const existing = state.items.find((itemState) =>
            itemState.productId === item.productId
          )

          if (existing) {
            existing.quantity = item.quantity
            syncWithLocalStorage(state.items)
            return
          }
          state.items.push(item)
          syncWithLocalStorage(state.items)

          state.addItemById.isLoading = false
          state.addItemById.isError = false
          state.addItemById.isSuccess = true
        }
      })
      .addCase(removeItemCart.pending, (state) => {
        state.removeItems.isLoading = true
        state.removeItems.isError = false
      })
      .addCase(removeItemCart.fulfilled, (state, action) => {
        if (action.payload) {
          const items = action.payload
          state.items = items
          state.removeItems.isLoading = false
          state.removeItems.isError = false
          syncWithLocalStorage(state.items)
        }
      })
      .addCase(removeItemCart.rejected, (state) => {
        state.removeItems.isLoading = false
        state.removeItems.isError = true
      })
      .addCase(updateItemById.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedItem = state.items.find((item) => item._id === action.payload?._id)
          if (updatedItem) {
            updatedItem.quantity = action.payload.quantity
          }
        }
        syncWithLocalStorage(state.items)
      })
      .addCase(clearUserCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = []
          syncWithLocalStorage(state.items)
        }
      })
  }
})

export const {
  setCart,
  clearCart,
  getCartStorage,
  updateItemQuantity,
  removeItemCartLocal,
  syncCart,
  confirmMerge,
  rejectMerge,
  showMergeDialog,
  resetAddItemById,
} = cartSlice.actions
export default cartSlice.reducer