/* global describe, test, expect */
/* eslint no-undef: "error" */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { getByTestId, screen } from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import { bills } from '../fixtures/bills.js'
import { ROUTES } from '../constants/routes'
import Bills from '../containers/Bills'

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', () => {
      // Rajout de ceci pour réaliser un test en tant qu'employé connecté
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const store = null
      const unBills = new Bills({ document, onNavigate, store, localStorage: window.localStorage })
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      expect(getByTestId(document.body, 'icon-window')).toHaveClass('active-icon')
    })

    test('Then bills should be ordered from earliest to latest', () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})
