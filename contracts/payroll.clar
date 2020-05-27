;; I'm going to first design a payroll smart contract 
;; and its interactions, it should be a contract per company 
;; between manager/bank and the workers, it should have methods 
;; to deposit salaries funds, and to check if enough funds 
;; have been deposited for salaries, maybe also manage bonuses, 
;; emergency funds, yearly promotions, and so on.

(define-data-var manager principal 'ST3PT63RKC10QYE20XDNPD01JVNG27QZ0D5D9N0V1)

(define-data-var funds uint u0)

(define-map workers ((address principal)) ((salary uint)))

(define-constant not-allowed-error (err 1))

(define-private (is-manager) 
   (is-eq tx-sender (var-get manager))
)

(define-private (workerExists (worker-address principal))
   (match (map-get? workers ((address worker-address)))
      entry true false)
)

(define-public (add-worker (address principal) (salary uint)) 
   (begin 
      (if (is-manager) 
         (begin (map-set workers ((address address)) ((salary salary))) (ok salary))
         not-allowed-error
      )
   )
)

(define-public (get-worker-salary (address principal)) 
   (match (map-get? workers ((address address)))
      entry (ok (get salary entry))
      (ok u0)))

(define-public (get-current-funds) (ok (var-get funds)))

