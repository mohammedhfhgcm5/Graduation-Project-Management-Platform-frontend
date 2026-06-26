import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Project, ProjectStatus } from '@/types';

interface ProjectFilters {
  status: ProjectStatus | 'ALL';
  search: string;
}

interface ProjectsState {
  list: Project[];
  total: number;
  page: number;
  limit: number;
  filters: ProjectFilters;
}

const initialState: ProjectsState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    status: 'ALL',
    search: '',
  },
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (
      state,
      action: PayloadAction<{
        list: Project[];
        total: number;
      }>,
    ) => {
      state.list = Array.isArray(action.payload.list) ? action.payload.list : [];
      state.total = Number.isFinite(action.payload.total) ? action.payload.total : 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<ProjectStatus | 'ALL'>) => {
      state.filters.status = action.payload;
      state.page = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        status: 'ALL',
        search: '',
      };
      state.page = 1;
    },
  },
});

export const {
  setProjects,
  setPage,
  setLimit,
  setStatusFilter,
  setSearchFilter,
  resetFilters,
} = projectsSlice.actions;

export default projectsSlice.reducer;
