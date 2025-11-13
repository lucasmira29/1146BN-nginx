import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../ui/button';

export function AlertaHorarioPendente() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="p-6 max-w-xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg shadow-lg mt-8"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-yellow-800">
            Ação Necessária: Defina seu Horário
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Percebemos que você ainda não configurou seu horário de trabalho.
            Para que os recepcionistas possam agendar consultas, por favor, defina
            seu expediente.
          </p>
          <div className="mt-4">
            <Link to="/dashboard/account">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer">
                <Clock className="w-4 h-4 mr-2" />
                Definir Horário Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}