/* global describe, test */
/* eslint no-undef: "error" */

import { screen } from '@testing-library/dom'
import { ROUTES } from '../constants/routes'
import { localStorageMock } from '../__mocks__/localStorage.js'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then ...', () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const store = null
      const html = NewBillUI()
      document.body.innerHTML = html
      const unBill = new NewBill(document, onNavigate, store, window.localStorage)
      // unBill.handleChangeFile()
      // unBill.handleSubmit()
    })
  })
})
