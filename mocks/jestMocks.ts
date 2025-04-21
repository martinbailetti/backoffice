import mockRouter from "next-router-mock";
mockRouter.push = jest.fn();

// Mock de HTMLFormElement.prototype.requestSubmit
HTMLFormElement.prototype.requestSubmit = jest.fn(function (submitter) {
  console.log("Mock requestSubmit called");
  if (submitter && submitter instanceof HTMLElement) {
    this.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  }
});

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("ol", () => {
  return {
    Feature: jest.fn().mockImplementation(() => {
      return {
        setGeometry: jest.fn(),
      };
    }),
    Map: jest.fn().mockImplementation(() => {
      return {
        setTarget: jest.fn(),
        addLayer: jest.fn(),
        getView: jest.fn().mockReturnValue({
          setCenter: jest.fn(),
          setZoom: jest.fn(),
        }),
      };
    }),
    MapBrowserEvent: jest.fn().mockImplementation(() => {
      return {};
    }),
    View: jest.fn().mockImplementation(() => {
      return {
        setCenter: jest.fn(),
        setZoom: jest.fn(),
      };
    }),
  };
});
jest.mock("ol/Geolocation", () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      getAccuracy: jest.fn(),
      getHeading: jest.fn(),
      getPosition: jest.fn(),
    };
  });
});
jest.mock("ol/style", () => {
  return {
    Icon: jest.fn().mockImplementation(() => {
      return {};
    }),
    Style: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});
jest.mock("ol/format/GeoJSON", () => {
  return jest.fn().mockImplementation(() => {
    return {
      readFeatures: jest.fn(),
      writeFeatures: jest.fn(),
    };
  });
});
jest.mock("ol/layer/Vector", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setSource: jest.fn(),
      setStyle: jest.fn(),
    };
  });
});

jest.mock("ol/proj", () => {
  return {
    fromLonLat: jest.fn(),
    toLonLat: jest.fn().mockReturnValue([1, 2]),
  };
});

jest.mock("ol/Feature", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setGeometry: jest.fn(),
      setStyle: jest.fn(),
    };
  });
});
jest.mock("ol/source/Vector", () => {
  return jest.fn().mockImplementation(() => {
    return {
      addFeature: jest.fn(),
      removeFeature: jest.fn(),
      clear: jest.fn(),
    };
  });
});
jest.mock("ol/geom/Point", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setCoordinates: jest.fn(),
    };
  });
});

jest.mock("ol/layer/Base", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setSource: jest.fn(),
    };
  });
});

jest.mock("ol/Map", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setTarget: jest.fn(),
      addLayer: jest.fn(),
      getView: jest.fn().mockReturnValue({
        setCenter: jest.fn(),
        setZoom: jest.fn(),
        on: jest.fn(),
      }),
      getLayers: jest.fn().mockReturnValue({
        getArray: jest.fn().mockReturnValue([]),
      }),
      on: jest.fn(),
    };
  });
});

jest.mock("ol/layer/Tile", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setSource: jest.fn(),
    };
  });
});

jest.mock("ol/source/OSM", () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock de window.location
const locationMock = {
  ...window.location,
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

Object.defineProperty(window, "location", {
  value: locationMock,
});
