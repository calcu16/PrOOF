# Copyright (c) 2012 Andrew Carter
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met: 
#
# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer. 
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution. 
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# The views and conclusions contained in the software and documentation are those
# of the authors and should not be interpreted as representing official policies, 
# either expressed or implied, of the FreeBSD Project.

def sqlite(**kwargs):
  from sqlite3 import connect
  from .pypp import preprocess
  
  def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
      d[col[0]] = row[idx]
    return d
  
  def strbuilder():
    result = ""
    def builder(s = None):
      nonlocal result
      if s is not None:
        result = "%s%s\n" % (result, s)
      return s
  
  class Connection(object):
    def __init__(**kwargs):
      nonlocal dict_factory
      self.conn = connect(**kwargs)
      self.cur = conn.cursor()
      self.scalar_factory = dict_factory
    def scalar(query, values):
      row = self.row(query, values)
      return row[self.cur.description[0]]
    def row(query, values):
      self.execute(query, values)
      return self.cur.fetchone()
    def query(query, values):
      self.execute(query, values)
      return self.cur.fetchall()
    def execute(query, values):
      query, values = self.build(query, values)
      return self.cur.execute(query, values)
    def script(query, values):
      query, values = self.build(query, values)
      return self.cur.executescript(query, values)
    def build(query, values):
      nonlocal strbuilder, preprocess
      values = dict(values)
      values['__SQL__'] = 'sqlite3'
      result = strbuilder()
      values = pypreprocess('sql/%s.sql' % query, values, result)
      return result(), values
  return Connection(**kwargs)
