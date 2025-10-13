import apiService from "../api/Api.jsx"
class ElementsActions {
  async getElements() {
    try {
      const response = await apiService.get("/elements")
      return response
    } catch (error) {
      throw error
    }
  }

  async getElement(id) {
    try {
      const response = await apiService.get(`/elements/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async createElement(elementData) {
    try {
      const formData = new FormData()
      Object.keys(elementData).forEach((key) => {
        if (key !== "logo") {
          if (Array.isArray(elementData[key])) {
            formData.append(key, JSON.stringify(elementData[key]))
          } else {
            formData.append(key, elementData[key])
          }
        }
      })

      if (elementData.logo) {
        formData.append("logo", elementData.logo)
      }

      const response = await apiService.postFormData("/elements", formData)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateElement(id, elementData) {
    try {
      const formData = new FormData()
      Object.keys(elementData).forEach((key) => {
        if (key !== "logo") {
          if (Array.isArray(elementData[key])) {
            formData.append(key, JSON.stringify(elementData[key]))
          } else {
            formData.append(key, elementData[key])
          }
        }
      })
      if (elementData.logo) {
        formData.append("logo", elementData.logo)
      }

      const response = await apiService.putFormData(`/elements/${id}`, formData)
      return response
    } catch (error) {
      throw error
    }
  }

  async deleteElement(id) {
    try {
      const response = await apiService.delete(`/elements/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default new ElementsActions()
