const getTimeFrameProgress = anchor => {
  const currentDate = new Date().getTime();
  const toMinutes = val => {
    return val / 60 / 1000;
  };
  const toMs = val => {
    return val * 60 * 1000;
  };
  return (100 * (currentDate % anchor)) / anchor;
};
export const state = () => ({
  timeframes: [
    {
      isSelected: false,
      name: "D",
      description: "Daily",
      anchor: 24 * 60 * 60 * 1000,
      progress: 0
    },
    {
      isSelected: false,
      name: "4H",
      description: "4 Heures",
      anchor: 4 * 60 * 60 * 1000,
      progress: 0
    },
    {
      isSelected: false,
      name: "1H",
      description: "1 Heures",
      anchor: 1 * 60 * 60 * 1000,
      progress: 0
    },
    {
      isSelected: false,
      name: "15M",
      description: "15 Minutes",
      anchor: 15 * 60 * 1000,
      progress: 0
    },
    {
      isSelected: false,
      name: "5M",
      description: "5 Minutes",
      anchor: 5 * 60 * 1000,
      progress: 0
    }
  ]
});

export const actions = {
  initializeTimeframes({ commit, state }, data) {
    const { timeframes } = state;
    timeframes.forEach(item => {
      setInterval(() => {
        const progress = getTimeFrameProgress(item.anchor);
        commit("setter_updateTF", { tf: item, data: { progress } });
      }, 500);
    });
  },
  addProductTocart({ commit, state }, data) {
    commit("setter_addProductToCart", data);
  }
};
export const mutations = {
  setter_updateTF(state, data) {
    const tfIndex = state.timeframes.findIndex(e => e.name === data.tf.name);
    if (tfIndex !== -1) {
      state.timeframes[tfIndex] = {
        ...state.timeframes[tfIndex],
        ...data.data
      };
    }
    state.timeframes = state.timeframes.filter(e => true);
  }
};

export const getters = {
  getter_timeframes(state) {
    return state.timeframes;
  }
};
