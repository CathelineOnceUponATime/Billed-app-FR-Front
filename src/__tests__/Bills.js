/* global describe, test, expect, jest, $ */
/* eslint no-undef: "error" */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, getByTestId, screen } from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import { bills } from '../fixtures/bills.js'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import Bills from '../containers/Bills'
import router from '../app/Router'

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    const store = null
    const unBills = new Bills({ document, onNavigate, store, localStorage: window.localStorage })
    const html = BillsUI({ data: bills })
    document.body.innerHTML = html
    $.fn.modal = jest.fn()
    test('icon-eye', () => {
      const iconEye = screen.getAllByTestId('icon-eye')[0]
      expect(iconEye).not.toBeUndefined()
      const modalImg = document.getElementById('modaleFile')
      expect(modalImg).not.toHaveClass('show')
      const handleClickIconEye = jest.fn(() => { unBills.handleClickIconEye(iconEye) })
      iconEye.addEventListener('click', handleClickIconEye)
      fireEvent.click(iconEye)
      expect(handleClickIconEye).toHaveBeenCalled()
      // expect(modalImg).toHaveClass('show')
      expect(iconEye).toHaveAttribute('data-bill-url')
    })

    test('constructor', () => {
      const btnNewBill = screen.getByTestId('btn-new-bill')
      expect(btnNewBill).not.toBeUndefined()
      const handleClickNewBill = jest.fn((e) => unBills.handleClickNewBill(e))
      btnNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    test('function', async () => {
      const handleClickNewBill = jest.fn(() => unBills.handleClickNewBill)
      await handleClickNewBill()
      expect(handleClickNewBill).toHaveBeenCalled()
    })

    test('Then bill icon in vertical layout should be highlighted', () => {
      const icon = screen.getByTestId('icon-window')
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      expect(icon).toHaveClass('active-icon')
    })

    test('test loading', () => {
      const html = BillsUI({ data: bills, loading: true })
      document.body.innerHTML = html
      const loadingDiv = document.getElementById('loading')
      expect(loadingDiv).not.toBeUndefined()
    })

    test('test error', () => {
      const html = BillsUI({ data: bills, error: true })
      document.body.innerHTML = html
      expect(getByTestId(document.body, 'error-message')).not.toBeUndefined()
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
